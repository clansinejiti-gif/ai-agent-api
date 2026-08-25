import User from "../models/userModels.js";
import bcrypt from "bcrypt";

async function checkIfUserExist(email) {
  const user = await User.findOne({ email });

  return !!user;
}
async function registerNewUser({ fullName, email, password, role }) {
  const exist = await checkIfUserExist(email);

  if (exist) {
    return { success: false, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ fullName, email, password: hashedPassword, role });

  return { success: true, data: { fullName, email, password: hashedPassword, role } };
}


async function loginUser({ email, password }) {
    const user = await User.findOne({ email });

    if (!user) {
        return { success: false, message:"Invalid Email or Password" }
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
        return { success: false, message:"Invalid Email or Password" }
    }

    return {
        success:true,
        data: { id: user._id, email: user.email, role: user.role }
    }
}

export { checkIfUserExist, registerNewUser, loginUser };
