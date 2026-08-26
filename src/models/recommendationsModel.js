import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  focusArea: {
    type: String,
    required: true,
    trim: true,
  },
  timeCommitmentHoursPerWeek: {
    type:Number,
    min: 0,
    max: 126,
    default: 1
  },
  primaryGoal: {
    type: String,
    required: true,
  },
},
{
    timestamps: true
});

export default mongoose.model("Recommendation", recommendationSchema)