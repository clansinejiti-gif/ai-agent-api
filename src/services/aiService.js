import { v4 as uuidv4 } from 'uuid';
import User from '../models/userModels.js';
import Books from '../models/booksModels.js';
import Recommendation from '../models/recommendationsModel.js';

export const createRecommendation = async (email, input) => {
  const { focusArea, timeCommitmentHoursPerWeek, primaryGoal } = input;

  // 1. Get student profile
  const profile = await User.findOne({ email });
  if (!profile) {
    return {
      message: "Student profile not found please complete your profile first."
    };
  }

  // 2. NEW: Check daily limit (2 per day)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todayCount = await Recommendation.countDocuments({
    userId: profile._id,
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  });

  if (todayCount >= 2) {
    return {
      message: "Daily limit reached. You can only create 2 recommendations per day. Try again tomorrow.",
      limit: 2,
      used: todayCount
    };
  }

  // 3. Find matching books
  const books = await Books.find({
    $or: [
      { category: { $regex: focusArea, $options: 'i' } },
      { tags: { $in: [new RegExp(focusArea, 'i')] } },
      { title: { $regex: focusArea, $options: 'i' } },
    ],
  }).limit(5);


  const recommendedBooks = books.map((book) => ({
    id: book._id.toString(),
    title: book.title,
    matchReason: `Directly aligns with your ${focusArea} focus area.`,
    bookUrl: book.bookUrl,
  }));

  // 3. Generate career advice
  const careerAdvice = {
    focusArea,
    roadmapStep: generateRoadmapStep(focusArea, timeCommitmentHoursPerWeek, primaryGoal),
  };

  // 4. Build final payload
  const recommendationId = `rec_${uuidv4().slice(0, 8)}`;

  const payload = {
    recommendationId,
    studentSummary: {
      major: profile.major,
      targetRole: profile.targetRole,
    },
    recommendedBooks,
    careerAdvice,
  };

  // 5. Save to database
  await Recommendation.create({
    recommendationId,
    userId: profile._id,
    focusArea,
    timeCommitmentHoursPerWeek,
    primaryGoal,
    studentSummary: payload.studentSummary,
    recommendedBooks: payload.recommendedBooks,
    careerAdvice: payload.careerAdvice,
  });

  return payload;
};

function generateRoadmapStep(focusArea, hours, goal) {
  if (hours < 5) {
    return `Focus on foundational concepts of ${focusArea} over the next 2 weeks with consistent short sessions.`;
  }

  if (goal.toLowerCase().includes('interview')) {
    return `Focus on ${focusArea} interview questions, system design patterns, and practical projects over the next 4 weeks.`;
  }

  return `Dedicate the next 4 weeks to deep practice in ${focusArea}, aiming for ${hours} hours per week.`;
}