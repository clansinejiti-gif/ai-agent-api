import { getTracks } from "../services/careerService.js";
import { successResponse } from "../utils/responseFormatter.js";

export const getCareerTracks = async (req, res, next) => {
  try {
    const { domain } = req.query;

    const tracks = await getTracks(domain);

    return successResponse(res, tracks);
  } catch (error) {
    next(error);
  }
};
