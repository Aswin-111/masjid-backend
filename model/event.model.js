import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    poster_url: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },

    masjid_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Masjid",
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
