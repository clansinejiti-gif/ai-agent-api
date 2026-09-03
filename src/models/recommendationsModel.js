import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    recommendationId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    focusArea: String,
    timeCommitmentHoursPerWeek: Number,
    primaryGoal: String,
    studentSummary: {
      major: String,
      targetRole: String,
    },
    recommendedBooks: [
      {
        id: String,
        title: String,
        matchReason: String,
      },
    ],
    careerAdvice: {
      focusArea: String,
      roadmapStep: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Recommendation', recommendationSchema);