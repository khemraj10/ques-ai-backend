import mongoose, { Document, Schema, Model } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
