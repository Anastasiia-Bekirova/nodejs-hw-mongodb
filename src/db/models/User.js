import { Schema, model } from "mongoose";

import { handleSaveError, setUpdateSettings } from "./hooks.js";
import { emailRegex } from "../../constants/users.js";


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        match: emailRegex,
        required: true,
    },
    password: {
        type: String,
        required: true,
     }
}, { versionKey: false, timestamps: true });

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", setUpdateSettings);
userSchema.post("findOneAndUpdate", handleSaveError);

const UserCollection = model("user", userSchema);

export default UserCollection;
