import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const isAdminExists = await User.findOne({ email: envVars.ADMIN_EMAIL });
    if (isAdminExists) {
      console.log("Admin already exists!!");
      return;
    }
    console.log("Trying to create Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Admin",
      role: Role.Admin,
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
    };
    const Admin = await User.create(payload);
    console.log("Admin created Successfully!!! \n");
    console.log(Admin);
  } catch (error) {
    console.log(error);
  }
};
