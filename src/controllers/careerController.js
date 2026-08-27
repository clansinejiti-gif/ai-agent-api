import { getTracks, createTrack } from "../services/careerService.js";
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


const registerTrack = async (req, res) => {
  try {
    const result = await createTrack(req.body);

    if (!result.success) {
      return res.status(409).json("Something went wrong");
    }

    res.status(201).json({result});
  } catch (err) {
    console.error("track error:", err);
    res.status(500).json({ error: "Something went wrong during creation" });
  }
};

export { registerTrack };
