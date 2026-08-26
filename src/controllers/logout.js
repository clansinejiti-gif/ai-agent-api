const logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json("could not logout");
      }

      res.status(200).json("Logout Succesfull");
    });
  } catch (err) {
    console.error("unexpected error", err);
    res.status(500).json("Something wnt wrong during logout");
  }
};

export { logout };
