import { Session } from "express-session";
import User from "../models/userModels.js";
import { updateProfile } from "../services/profileService.js";

const authMe = async (req, res, next) => {
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
    next(err);
  }
};

const profileMe = async (req, res, next) => {
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
    next(err);
  }
};

const profilePutMe = async (req, res, next) => {
  try {
    if (req.session.role !== "student") {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "Access Denied" },
      });
    }

    const result = await updateProfile(req.session.userId, req.body);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: result.message },
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
};

export { authMe, profileMe, profilePutMe };
