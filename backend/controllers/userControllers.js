import User from "../models/userModel.js";

const getUserData = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: 'User Not Found'
      });
    }
    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified
      }
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message
    });
  }
};

export default getUserData;
