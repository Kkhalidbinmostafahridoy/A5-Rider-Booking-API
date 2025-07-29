// import tr from "zod/v4/locales/tr.cjs";
import { IUser } from "./user.interface";
import { User } from "./user.model";
// import AppError from "../../errorHelpers/AppError";
// import httpStatus from "http-status-codes";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email, password } = payload;
  const user = await User.create({ name, email, password });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  const user = await User.findByIdAndUpdate(id, payload, { new: true });
  return user;
};

const checkIfUserBlocked = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return user.isActive;
};

const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  return user;
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  checkIfUserBlocked,
};
