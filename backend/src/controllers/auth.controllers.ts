import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { getUserByEmail, getUserById, createUser } from "../db/queries/users.queries.js";
import jwt from "jsonwebtoken";
import config from "../backendConfig.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if(!email || !password || !name) {
      const resPayload: ApiResponse<null> = {
        status: 400,
        success: false,
        data: null,
        message: "Missing required fields",
      };
      return res.status(400).json(resPayload);
    }
    
    const existingUser = await getUserByEmail({ email });
    
    if(existingUser) {
      const resPayload: ApiResponse<null> = {
        status: 409,
        success: false,
        data: null,
        message: "User already exists",
      };
      return res.status(409).json(resPayload);
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await createUser({ email, password: hashedPassword, name });
    
    const resPayload: ApiResponse<typeof newUser> = {
      status: 201,
      success: true,
      data: newUser,
      message: "User created successfully",
    };
    
    const token = jwt.sign({ id: newUser?.id, role: newUser?.role }, config.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: config.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return res.status(201).json(resPayload);
  } catch (error) {
    console.error("Error creating user", error);
    const resPayload: ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: "Internal server error",
    };
    return res.status(500).json(resPayload);
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
  
    if(!email || !password) {
      const resPayload: ApiResponse<null> = {
        status: 400,
        success: false,
        data: null,
        message: "Missing required fields",
      };
      return res.status(400).json(resPayload);
    }
    
    const existingUser = await getUserByEmail({ email });
    const isPasswordValid = existingUser && await bcrypt.compare(password, existingUser.password);
    if (!existingUser || !isPasswordValid) {
      const resPayload: ApiResponse<null> = {
        status: 401,
        success: false,
        data: null,
        message: "Invalid credentials",
      };
      return res.status(401).json(resPayload);
    }
  
    const token = jwt.sign({ id: existingUser.id , role: existingUser.role}, config.JWT_SECRET, { expiresIn: "7d" });
  
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: config.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  
    const resPayload: ApiResponse<typeof existingUser> = {
      status: 200,
      success: true,
      data: existingUser,
      message: "Login successful",
    };
  
    return res.status(200).json(resPayload);
  } catch (error) {
    console.error("Login error:", error);
    const resPayload: ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: "Internal server error",
    };
    return res.status(500).json(resPayload);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: config.NODE_ENV !== "development",
    });
    const resPayload: ApiResponse<null> = {
      status: 200,
      success: true,
      data: null,
      message: "Logged out successfully",
    };
    return res.status(200).json(resPayload);
  } catch (error) {
    console.error("Logout error:", error);
    const resPayload: ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: "Internal server error",
    };
    return res.status(500).json(resPayload);
  }
};


export const check = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      const resPayload: ApiResponse<typeof req.user> = {
        status: 200,
        success: true,
        data: req.user,
        message: "User authenticated successfully",
      };
      return res.status(200).json(resPayload);
    } else {
      const resPayload: ApiResponse<null> = {
        status: 401,
        success: false,
        data: null,
        message: "User not authenticated",
      };
      return res.status(401).json(resPayload);
    }
  } catch (error) {
    console.error("Check error:", error);
    const resPayload: ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: "Internal server error",
    };
    return res.status(500).json(resPayload);
  }
};