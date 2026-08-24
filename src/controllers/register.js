import { registerNewUser } from "../services/authService.js";

const registerUser = async (req, res) => {
  try {
    const result = await registerNewUser(req.body);

    if (!result.success) {
      return res.status(409).json("user not registered");
    }

    res.status(201).json("user created");
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ error: "Something went wrong during registration" });
  }
};

export { registerUser };
