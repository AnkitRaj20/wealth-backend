
import httpStatus from "http-status";
import Joi from "joi";
import { DataTypes } from "sequelize";
import sendResponse from "../utils/apiResponse.js";

// Mapping between Sequelize data types and Joi validation types
const sequelizeToJoiMap = {
  [DataTypes.STRING]: Joi.string().allow(""),
  [DataTypes.INTEGER]: Joi.number().integer(),
  [DataTypes.BOOLEAN]: Joi.boolean(),
  [DataTypes.DATE]: Joi.date(),
  [DataTypes.FLOAT]: Joi.number(),
  [DataTypes.DECIMAL]: Joi.number(),
  [DataTypes.TEXT]: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.object()))
    .allow(""),
  [DataTypes.TEXT("long")]: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.object()))
    .allow(""),
  [DataTypes.JSONB]: Joi.any(),
  [DataTypes.BLOB]: Joi.string().allow(""),
  [DataTypes.UUID]: Joi.string().guid(),
  [DataTypes.DATEONLY]: Joi.date(),
  [DataTypes.TIME]: Joi.string(), // Time fields are generally strings in Sequelize
  // Default handling for ENUM will be added dynamically below
};

const generateJoiSchema = (model) => {
  const schema = {};

  for (const [attribute, column] of Object.entries(model.rawAttributes)) {
    // Skip auto-managed fields by Sequelize
    if (["createdAt", "updatedAt"].includes(attribute)) {
      continue;
    }

    // Skip auto-increment fields
    if (column.autoIncrement) {
      continue;
    }

    // Handle ENUM separately
    if (column.type instanceof DataTypes.ENUM) {
      schema[attribute] = Joi.string().valid(...column.type.values);
      continue;
    }

    // Map Sequelize data type to Joi validation type
    let joiField = sequelizeToJoiMap[column.type?.key];

    if (!joiField) {
      console.warn(`Unhandled Sequelize type for field: ${attribute}`);
      continue; // Skip unhandled types
    }

    // Add required validation for fields that are not nullable and don't have a default value
    if (column.allowNull === false && column.defaultValue === undefined) {
      joiField = joiField.required();
    } else {
      joiField = joiField.optional().allow(null);
    }

    schema[attribute] = joiField;
  }

  return Joi.object(schema);
};

// Middleware for validation
const validateModel = (model) => {
  const schema = generateJoiSchema(model);
  return async (req, res, next) => {
    try {
      // Preprocess req.body for TEXT("long") fields to ensure they are strings
      for (const [attribute, column] of Object.entries(model.rawAttributes)) {
 
        if (
          column.type?.key === DataTypes.TEXT("long").key &&
          req.body[attribute]
        ) {
          const value = req.body[attribute];
          if (Array.isArray(value)) {

            req.body[attribute] = JSON.stringify(value); // Convert array to JSON string
          } else if (typeof value === "object") {
            req.body[attribute] = JSON.stringify(value); // Convert object to JSON string
          } else if (typeof value !== "string") {
            req.body[attribute] = String(value); // Convert any other type to string
          }
        }
        if (column.type?.key === DataTypes.STRING.key && req.body[attribute]) {
          req.body[attribute] =
            typeof req.body[attribute] === "string"
              ? req.body[attribute]
              : String(req.body[attribute]);
        }
      }

      await schema.validateAsync(req.body, {
        abortEarly: false,
        allowUnknown: false, // Reject fields not in the schema
      });
      // return console.log(req.body)
      return next();
    } catch (err) {
      console.log(err);

      return sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        null,
        err?.details?.map((e) => ({
          message: e.message,
          path: e.path,
        }))
      );
    }
  };
};

export default validateModel;
