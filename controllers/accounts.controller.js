import Account from "../models/account.model.js";
import User from "../models/user.model.js";
import sendResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import httpStatus from "http-status";

// Create Account
export const createAccount = asyncHandler(async (req, res) => {
  const { userId, name, type, balance, isDefault } = req.body;
  // Check if user exists
  const user = await User.findByPk(userId);
  if (!user) {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      "User with this id does not exist"
    );
  }
  // Check if this is user's first account or not
  const existingAccounts = await Account.findAll({
    where: { userId },
  });
  // Determine default account
  const shouldBeDefaultAccount =
    existingAccounts.length === 0 ? true : isDefault;

  // Update all accounts to not default before creating a new one
  await Account.update({ isDefault: false }, { where: { userId } });

  // Create account
  const newAccount = await Account.create({
    name,
    type,
    balance,
    isDefault: shouldBeDefaultAccount,
    userId,
  });

  if (!newAccount) {
    return sendResponse(res, httpStatus.BAD_REQUEST, "Account creation failed");
  }

  return sendResponse(
    res,
    httpStatus.CREATED,
    "Account created successfully",
    newAccount
  );
});

// Get All Accounts
export const getAllAccounts = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if(!id){
    return sendResponse(res, httpStatus.BAD_REQUEST, "User id is required");
  }

  const accounts = await Account.findAndCountAll({
    where: { userId: id },
    order: [["createdAt", "DESC"]],
  });

  if (!accounts.rows || accounts.rows.length === 0) {
    return sendResponse(res, httpStatus.BAD_REQUEST, "No accounts found");
  }

  return sendResponse(res, httpStatus.OK, accounts.rows, accounts.count);
});


// Update Default Account
export const updateDefaultAccount = asyncHandler(async (req, res) => {
  const { accountId, userId } = req.body;

  if (!userId || !accountId) {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      "userId and accountId are required"
    );
  }
  // Check if user exists
  const user = await User.findByPk(userId);
  if (!user) {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      "User with this id does not exist"
    );
  }

  // Check if account exists
  const account = await Account.findByPk(accountId);
  if (!account) {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      "Account with this id does not exist"
    );
  }
console.log("-----------------")
  console.log(account.userId)
  console.log(userId)
  // Check if account belongs to the user
  if (parseInt(account.userId) !== parseInt(userId)) {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      "Account does not belong to the user"
    );
  }

  // Update default account logic
  await Account.update({ isDefault: false }, { where: { userId } });
  await Account.update({ isDefault: true }, { where: { id: accountId } });

  return sendResponse(
    res,
    httpStatus.OK,
    "Default account updated successfully"
  );
});
