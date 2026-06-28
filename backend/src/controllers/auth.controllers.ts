import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { getUser, createUser } from "../db/queries/users.queries.js";
import jwt from "jsonwebtoken";
import config from "../backendConfig.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if(!email || !password || !name) {
      const resMessage: ApiResponse<null> = {
        status: 400,
        success: false,
        data: null,
        message: "Missing required fields",
      };
      return res.status(400).json(resMessage);
    }
    
    const existingUser = await getUser({ email });
    
    if(existingUser) {
      const resMessage: ApiResponse<null> = {
        status: 409,
        success: false,
        data: null,
        message: "User already exists",
      };
      return res.status(409).json(resMessage);
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await createUser({ email, password: hashedPassword, name });
    
    const resMessage: ApiResponse<typeof newUser> = {
      status: 201,
      success: true,
      data: newUser,
      message: "User created successfully",
    };
    
    const token = jwt.sign({ id: newUser?.id }, config.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: config.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return res.status(201).json(resMessage);
  } catch (error) {
    console.error("Error creating user", error);
    const resMessage: ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: "Internal server error",
    };
    return res.status(500).json(resMessage);
  }
};


export const login = async (req: Request, res: Response) => {
  
};

export const logout = async (req: Request, res: Response) => {
  
};

export const check = async (req: Request, res: Response) => {
  
};