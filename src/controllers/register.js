import { registerNewUser } from "../services/authService.js";

const registerUser = async (req, res, next) => {
  try {
    const result = await registerNewUser(req.body);

    if (!result.success) {
      return res.status(409).json("User already exist");
    }

    const id = req.session.userId;
    const fullName = result.data.fullName;
    const email = result.data.email;
    const role = result.data.role;

    res
      .status(201)
      .json({
        success: true,
        message: "Account Created Successfully",
        data: { id, fullName, email, role },
      });
    console.log(result);
  } catch (err) {
    console.error("register error:", err);
    next(err);
  }
};

export { registerUser };
