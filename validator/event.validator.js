import {z} from "zod"

const addEventSchema = z.object({
    title : z.string({required_error : "Title is required"}),
    description : z.string({required_error : "Description is required"}),
    date : z.string({required_error : "Date is required"}),
    masjid_id : z.string({required_error : "Masjid id is required"})
   
})

export {addEventSchema}