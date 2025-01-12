import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fileupload from "express-fileupload";
import path from "path";
import User from "./models/user.model.js";
import Budget from "./models/budget.model.js";
import Account from "./models/account.model.js";
import Transaction from "./models/transaction.model.js";
// import apiRoutes from "./routes/routes.js";
import router from "./routes/index.js";
import { globalErrorHandler } from "./utils/error.utils.js";
// import apiRoutes from './routes/routes.js'

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "2000mb" }));
app.use(cors({ origin: "*" }));
app.use(fileupload());
app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use("/api/v1", router);
app.use(globalErrorHandler);

// User.sync({ alter: true }).then(() => {
//   console.log("User table created");
// });
// Transaction.sync({ alter: true }).then(() => {
//   console.log("Transaction table created");
// });
// Budget.sync({ alter: true }).then(() => {
//   console.log("Budget table created");
// });
// Account.sync({ alter: true }).then(() => {
//   console.log("Account table created");
// });


app.listen(PORT, () => {
  console.log(`App is listening at PORT ${PORT}`);
});