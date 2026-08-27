import { registerNewUser } from "../services/authService.js";

const registerUser = async (req, res, next) => {
  try {
    const result = await registerNewUser(req.body);

    if (!result.success) {
      return res.status(409).json("User not registered");
    }

    res.status(201).json("Account Created Successfully");
    console.log(result);
  } catch (err) {
    console.error("register error:", err);
    next(err);
  }
};

export { registerUser };
