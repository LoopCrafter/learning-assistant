import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import type { IUser } from "../types/models.js";

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "please provide a username"],
      unique: true,
      trim: true,
      minLength: [3, "username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "please provide a password"],
      minLength: [6, "password must be at least 6 characters long"],
      select: false,
    },
    profileImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  // next رو حذف کن
  if (!this.isModified("password")) {
    return; // early return بدون next()
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // next() رو حذف کن—Mongoose منتظر resolve می‌مونه
  } catch (err) {
    console.error("Password hashing error:", err); // "hamed" رو به error تغییر دادم برای بهتر بودن
    throw err; // throw کن به جای next(err)—Mongoose handle می‌کنه
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUser>("User", UserSchema);

export default User;
