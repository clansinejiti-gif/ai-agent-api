import User from "../models/userModels.js";

const allowedFields = [
  "academicLevel",
  "major",
  "targetRole",
  "skills",
  "preferredGenres",
  "learningStyle",
];

async function updateProfile(userId, body) {
  const sanitized = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) sanitized[field] = body[field];
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: sanitized },
    { new: true, runValidators: true },
  );

  if (!updatedUser) {
    return { success: false, message: "Profile not found" };
  }

  return { success: true, data: { updatedAt: updatedUser.updatedAt } };
}

export { updateProfile };
