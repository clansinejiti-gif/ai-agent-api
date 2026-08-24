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
  const newUser = await User.create({ fullName, email, role });

  return { success: true, data: { fullName, email, role } };
}

export { checkIfUserExist, registerNewUser };
