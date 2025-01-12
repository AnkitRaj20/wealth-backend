
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import httpStatus from "http-status";
import User from "../models/user.model.js";
import dotenv from 'dotenv'

dotenv.config()

export const createToken = async (data) => {
    console.log("process.env.JWT_SECRET",process.env.JWT_SECRET)
  try {
    const getUser = await User.findOne({
      where: { [Op.or]: [{ email: data }, { mobile: data }] },
    });
    if (!getUser) {
      throw {
        status: false,
        message: "User not found",
        httpStatus: httpStatus.FORBIDDEN,
      };
    }
    const token = jwt.sign(
      {
        id: getUser.id,
        email: getUser.email,
        organization: getUser.organization,
        privilegeType: getUser.privilegeType,
        userType: getUser.userType,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return token;
  } catch (error) {
    throw {
      status: false,
      message: error.message,
    };
  }
};

export const verifyToken = (token) => {
  try {
    if (!token) {
      return null;
    }
    // Verify the token synchronously
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      throw {
        status: false,
        httpStatus: httpStatus.FORBIDDEN,
        message: "Token has expired. Please log in again.",
      };
    }
    if (error.name === "JsonWebTokenError") {
      throw {
        status: false,
        httpStatus: httpStatus.UNAUTHORIZED,
        message: "Invalid token.",
      };
    }
    throw {
      status: false,
      httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while verifying the token.",
    };
  }
};
export const tokenVerify = (req, res, next) => {
  try {
    const token = req.headers["authorization"]
      ? req.headers["authorization"].split(" ")[1]
      : null;

    if (!token) {
      throw {
        status: false,
        message: "Token is required.",
        httpStatus: httpStatus.FORBIDDEN,
      };
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      throw {
        status: false,
        message: "Invalid or expired token.",
        httpStatus: httpStatus.FORBIDDEN,
      };
    }

    req.user = decoded;
    if (req.method === "POST") req.body.createdBy = decoded.id;
    if (req.method === "PUT") req.body.updatedBy = decoded.id;

    next();
  } catch (error) {
    // Pass the error to the global error handler
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    if (req.user.privilegeType !== "admin") {
      throw {
        status: false,
        message: "You are not an admin",
        httpStatus: httpStatus.FORBIDDEN,
      };
    }
    next();
  } catch (error) {
    next(error);
  }
};
