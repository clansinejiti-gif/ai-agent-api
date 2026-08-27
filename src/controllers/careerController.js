import { getTracks, createTrack } from "../services/careerService.js";
import { successResponse } from "../utils/responseFormatter.js";

export const getCareerTracks = async (req, res, next) => {
  try {
    const { domain } = req.query;

    const tracks = await getTracks(domain);

    return successResponse(res, tracks);
  } catch (err) {
    next(err);
  }
};


const registerTrack = async (req, res, next) => {
  try {
    const result = await createTrack(req.body);

    if (!result.success) {
      return res.status(409).json("Something went wrong");
    }

    res.status(201).json({result});
  } catch (err) {
    console.error("track error:", err);
    next(err)
  }
};

export { registerTrack };
