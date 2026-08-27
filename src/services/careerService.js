import careerTrack from "../models/careerTrackModel.js";

export const getTracks = async (domain) => {
  let results = await careerTrack.find({domain})

  if (domain) {
    const search = domain.toLowerCase().trim();
    results = results.filter((track) =>
      track.domain.toLowerCase().includes(search),
    );
  }

  return results.map(({ trackId, title, keySkills, industryDemand }) => ({
    trackId,
    title,
    keySkills,
    industryDemand,
  }));
};

async function createTrack({
  trackId,
  domain,
  title,
  keySkills,
  industryDemand,
}) {
  if (!trackId || !title || !keySkills || !industryDemand || !domain) {
    return res.status(401).json({
      success: false,
      message: "Include all fields",
    });
  }
  const exist = await careerTrack.findOne({ trackId });

  if (exist) {
    return { success: false, message: "Track already exists" };
  }

  const industryDemandToLocalCase = industryDemand.toLowerCase();
  const newTrack = await careerTrack.create({
    trackId,
    domain,
    title,
    keySkills,
    industryDemand: industryDemandToLocalCase,
  });

  return {
    success: true,
    data: { trackId, title, domain, keySkills, industryDemand },
  };
}

export {createTrack}