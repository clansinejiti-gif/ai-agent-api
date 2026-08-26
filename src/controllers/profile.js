import { Session } from "express-session";
import User from "../models/userModels.js";

const authMe = async (req, res) => {
  try {
    const result = await User.findById(req.session.userId);

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    const id = req.session.userId;
    const email = req.session.email;
    const role = req.session.role;
    const sessionExpires = req.session.cookie.expires;

    res
      .status(200)
      .json({ success: true, data: { id, email, role, sessionExpires } });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "Something went wrong getting the profile" });
  }
};

const profileMe = async (req, res) => {
  try {
    const result = await User.findById(req.session.userId);

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    const userId = req.session.userId;
    const accademiclevel = result.academicLevel;
    const major = result.major;
    const targetRole = result.targetRole;
    const skills = result.skills;
    const preferredGenres = result.preferredGenres;
    const learningStyle = result.learningStyle;

    if (req.session.role !== "student") {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }
    res.status(200).json({
      success: true,
      data: {
        userId,
        accademiclevel,
        major,
        targetRole,
        skills,
        preferredGenres,
        learningStyle,
      },
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "Something went wrong getting the profile" });
  }
};

export { authMe, profileMe };
