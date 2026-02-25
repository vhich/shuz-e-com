export const getAdminData = async (req, res) => {
  try {
    const admin = req.admin;

    // Safety check in case the middleware didn't run or failed silently
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        username: admin.username,
        loggedIn: admin.loggedIn,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("GET_ADMIN_DATA_ERROR:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
