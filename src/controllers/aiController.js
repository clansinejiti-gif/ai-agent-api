import { createRecommendation } from '../services/aiService.js';
import { successResponse } from '../utils/responseFormatter.js';

export const generateRecommendations = async (req, res, next) => {
  try {
    if (req.session.role === 'admin') {
          return errorResponse(res, "Only students are allowed");
        }
        
    const email = req.session.email;
    const { focusArea, timeCommitmentHoursPerWeek, primaryGoal } = req.body;

    const recommendation = await createRecommendation(email, {
      focusArea,
      timeCommitmentHoursPerWeek,
      primaryGoal,
    });

    return successResponse(res,recommendation);
  } catch (error) {
    next(error);
  }
};