import { ZodSafeParseResult } from "zod";

export function responseZodError<T>(
  validator: ZodSafeParseResult<T>,
): string | undefined {
  if (validator.success) {
    return undefined;
  }
  const error = validator.error.issues.map((err) => err.message);
  return JSON.stringify(error);
}
