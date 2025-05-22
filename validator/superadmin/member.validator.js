import { z } from "zod";

const addMemberSchema = z.object({
  full_name: z.string({ required_error: "Full name is required" }),
  age: z.string({ required_error: "Age is required" }),
  father_name: z.string({ required_error: "Father's name is required" }),
  phone_number: z.string({ required_error: "Phone number is required" }),
  address: z.string({ required_error: "Address is required" }),
  occupation: z.string({ required_error: "Occupation is required" }),
  qualification: z.string({ required_error: "Qualification is required" }),
  role_id: z.string({ required_error: "Role id is required" }),
  masjid_id: z.string({ required_error: "Masjid id is required" }),
});

export { addMemberSchema };
