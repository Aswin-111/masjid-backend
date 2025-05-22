import {z} from "zod"

const createMasjidSchema = z.object({
    masjid_name : z.string({required_error : "Masjid name is required"}),
    address : z.string({required_error : "Address is required"}),
    phone_number : z.string({required_error : "Phone number is required"}).min(10, "Phone number must be atleast 10 numbers"),
})

export {createMasjidSchema}