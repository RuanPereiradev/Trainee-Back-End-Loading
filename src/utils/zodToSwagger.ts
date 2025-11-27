import zodToJsonSchema from "zod-to-json-schema";

export function buildJsonSchema(schema: any, title?: string) {
  return zodToJsonSchema(schema, title ?? "Schema");
}
