import mongoose from "mongoose";

const internSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"]
    },
    internId: {
      type: String,
      required: [true, "Intern ID is required"],
      unique: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Intern = mongoose.model("Intern", internSchema);
export default Intern;
