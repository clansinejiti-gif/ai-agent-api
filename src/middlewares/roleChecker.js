import { errorResponse } from "../utils/responseFormatter.js"
export const roleCheck = (req, res, next) => {
    if (req.session.role && req.session.role === 'admin' && req.session.userId) {
      return next();
    }
    return errorResponse(res)
}