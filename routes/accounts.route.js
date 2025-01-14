import { Router } from "express";
import validateModel from "../middlewares/validate.middleware.js";
import Account from "../models/account.model.js";
import { createAccount, getAllAccounts, updateDefaultAccount } from "../controllers/accounts.controller.js";


const accountRouter = Router()

accountRouter.route("/").post(validateModel(Account) ,createAccount)
accountRouter.route("/:id").get(getAllAccounts)
accountRouter.route("/updatedDefaultAccount").put(updateDefaultAccount)

export default accountRouter