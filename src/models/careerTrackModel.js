import mongoose from "mongoose";

const careerTrackSchema = new mongoose.Schema({
  trackId: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  title: {
    type:String,
    required: true
  },
  domain: {
    type: String,
    required: true,
  },
  keySkills: [String],
  industryDemand: {
    required: true,
    type: String , 
    enum: ["high", "low", "medium"],
    default: "medium"
  }
}
);

export default mongoose.model("careerTrack", careerTrackSchema)