import { loginUser } from "../services/authService.js"

const login = async (req, res, next) => {
    try {
        const result = await loginUser(req.body);

        if (!result.success) {
            return res.status(401).json({ success: false, error: { code: "INVALID_CREDENTIALS", message: result.message }})
        }

        req.session.userId = result.data.id;
        req.session.role = result.data.role;
        req.session.email = result.data.email;

        res.status(200).json({ success: true, message: "Login successful", data: result.data });
    } catch(err) {
        console.error("login error:", err);
        next(err);
    }
}

export { login }