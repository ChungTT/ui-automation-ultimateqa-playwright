import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export function validateWithSchema(schemaPath: string, data: unknown): void {
  const resolved = path.isAbsolute(schemaPath)
    ? schemaPath
    : path.resolve(process.cwd(), schemaPath);

  let schemaJson: any;
  try {
    schemaJson = JSON.parse(fs.readFileSync(resolved, "utf-8"));
  } catch (e) {
    console.error(`❌ Không đọc được schema: ${resolved}`, e);
    throw new Error(`Cannot read schema at ${resolved}`);
  }

  const validate = ajv.compile(schemaJson);
  const ok = validate(data);
  if (!ok) {
    console.error("❌ Schema validation failed:", validate.errors);
    throw new Error(`Schema validation failed for ${resolved}`);
  }
}
