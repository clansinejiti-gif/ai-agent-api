import { errorResponse } from "../utils/responseFormatter.js";

export const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.session?.role;
    const userId = req.session?.userId;

    if (!userId || !userRole) {
      return errorResponse(res, "Not authenticated, please login", 401);
    }

    if (!allowedRoles.includes(userRole)) {
      return errorResponse(
        res,
        `Forbidden role`,
        403,
      );
    }

    return next();
  };
};
