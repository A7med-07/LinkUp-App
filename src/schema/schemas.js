import * as zod from "zod";

export const schemaRegister = zod.object({
  name: zod.string().min(1, "Name is required").min(3, "Min 3 chars").max(25, "Max 25 chars"),
  username: zod.string()
    .regex(/^[a-z0-9_]{3,30}$/, "Lowercase, numbers and underscore only")
    .optional().or(zod.literal("")),
  email: zod.string().min(1, "Email is required")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
  password: zod.string().min(1, "Password is required")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Min 8 chars, uppercase, lowercase, number, special char"),
  rePassword: zod.string().min(1, "Please confirm password"),
  gender: zod.string().min(1, "Gender is required"),
  dateOfBirth: zod.coerce.date().refine((v) => {
    return new Date().getFullYear() - v.getFullYear() >= 20;
  }, "Must be at least 20 years old"),
}).refine((d) => d.password === d.rePassword, { path: ["rePassword"], message: "Passwords don't match" });

export const schemaLogin = zod.object({
  email: zod.string().min(1, "Email is required")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
  password: zod.string().min(1, "Password is required"),
});
