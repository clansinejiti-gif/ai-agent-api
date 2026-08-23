import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
    },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  skillLevel: {
    type: String,
  },
  tags: [String]
},
{
    timestamps: true
});

export default mongoose.model("Books", booksSchema)