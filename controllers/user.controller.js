import { Op } from "sequelize";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendResponse from "../utils/apiResponse.js";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { createToken } from "../utils/token.utils.js";


export const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation
  // check if user exists
  // check for images,avatar
  // upload to the cloudinary server
  // create user object and send in the database
  // remove password and refresh token from the response
  // check for user creation
  // return res

  let { email, name, password, mobile, imageUrl = null } = req.body;
  const salt = await bcrypt.genSalt(10);

  // Hash the password
  password = await bcrypt.hash(password, salt);

  console.log(email, name, password, mobile, imageUrl);

  // Check if user exists
  const existedUser = await User.findOne({
    where: {
      [Op.or]: {
        email,
        mobile,
      },
    },
  });

  if (existedUser) {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      "User with this email or mobile already exists"
    );
  }

  // Handle file uploading logic for avatar and cover image if required here

  // try {
    const user = await User.create({
      name: name,
      email: email,
      password: password,
      mobile: mobile,
      imageUrl: imageUrl || "https://default-avatar-url.com", // Add a default avatar URL if imageUrl is not provided
    });

    // Don't send password in the response
    delete user.password;
    console.log("user created", user);

    const token = await createToken(email);

    let userData = {
      // id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      token,
      // avatar: user.imageUrl,
    };

    return sendResponse(
      res,
      httpStatus.CREATED,
      userData,
      "user created successfully"
    );
  // } catch (error) {
  //   console.error("Error while creating user:", error);

  //   return sendResponse(
  //     res,
  //     httpsStatus.BAD_REQUEST,
  //     "Something went wrong while registering the user"
  //   );
  // }
});


export const loginUser = asyncHandler(async (req,res) => {
  let {field, password} = req.body;
  let user = await User.findOne({
    where: { [Op.or]: [{ email: field }, { mobile: field }] },
    attributes: {
      exclude: [
        "createdAt",
        "updatedAt",
        // "createdBy",
        // "updatedBy",
        "deletedAt",
      ],
    }, // Example fields to exclude
  });

  if (!user) {
    throw {
      status: false,
      message: "User not found",
      httpStatus: httpStatus.UNAUTHORIZED,
    };
    // sendResponse(res, 401, "User not found");
  }

  const hashedPassword = user?.password;
  const comparison = await bcrypt.compare(password, hashedPassword);

  if (!comparison) {
    throw {
      status: false,
      message: "Invalid password",
      httpStatus: httpStatus.UNAUTHORIZED,
    };
    //  sendResponse(res, 401, "Invalid password");
  }

    // Convert Sequelize instance to plain object to be able to delete properties
    const userData = user.toJSON();
    delete userData.password;

  const token = await createToken(field);

  const data = {
    userData,
    token,
  }
  return sendResponse(
    res,
    httpStatus.CREATED,
    data,
    "user logged in successfully"
  );
});
