const logout = (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json("could not logout");
      }

      res.status(200).json({
        success: true,
        message: "Session terminated successfully",
      });
    });
  } catch (err) {
    console.error("unexpected error", err);
    next(err)
  }
};

export { logout };
