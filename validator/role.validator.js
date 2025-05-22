import { z } from "zod";

const addRoleSchema = z.object({
  role_name: z.string({ required_error: "Role name is required" }),
  description: z.string().optional(),
  // masjid_id : z.string({required_error : "Masjid id is required"}),
});

export { addRoleSchema };
