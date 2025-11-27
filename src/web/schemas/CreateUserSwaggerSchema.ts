
import { buildJsonSchema } from "../../utils/zodToSwagger";
import { createUserSchema } from "./UserSchema";

export const createUserSwaggerSchema = {
  body: buildJsonSchema(createUserSchema, "CreateUserBody"),
  response: {
    201: buildJsonSchema(createUserSchema, "CreateUserResponse"),
  }
};
