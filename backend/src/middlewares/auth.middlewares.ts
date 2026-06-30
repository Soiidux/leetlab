import jwt from 'jsonwebtoken';
import config from '../backendConfig.js';
import { getUserById } from '../db/queries/users.queries.js';
import type { Request, Response, NextFunction } from 'express';


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    if(!token || token === '') {
      const resPayload : ApiResponse<null> = {
        status: 401,
        success: false,
        data: null,
        message: 'Unauthorized',
      };
      return res.status(401).json(resPayload);
    }
    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT_SECRET);
      
    } catch (error) {
      console.error("Error in auth middleware", error);
      const resPayload : ApiResponse<null> = {
        status: 401,
        success: false,
        data: null,
        message: 'Unauthorized',
      };
      return res.status(401).json(resPayload);
    }
    const existingUser = await getUserById({ id: (decoded as jwt.JwtPayload).id });
    if(!existingUser) {
      const resPayload : ApiResponse<null> = {
        status: 401,
        success: false,
        data: null,
        message: 'Unauthorized',
      };
      return res.status(401).json(resPayload);
    }

    req.user = existingUser;
    next();
  } catch (error) {
    console.log("Error in auth middleware", error);
    const resPayload : ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: 'Internal Server Error',
    };
    return res.status(500).json(resPayload);
  }
}

export const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if(!user || user.role !== "ADMIN"){
            const resPayload : ApiResponse<null> = {
                status: 403,
                success: false,
                data: null,
                message: 'Forbidden',
            };
            return res.status(403).json(resPayload);
        }

        next();
    } catch (error) {
        console.error("Error checking admin role:", error);
        const resPayload : ApiResponse<null> = {
            status: 500,
            success: false,
            data: null,
            message: 'Internal Server Error',
        };
        return res.status(500).json(resPayload);
    }
}