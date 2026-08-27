import { errorResponse, successResponse } from "../utils/responseFormatter.js";
import {
  getBooksService,
  createBookService,
  checkBookExistsService,
} from "../services/bookServices.js";

export const getBooks = async (req, res, next) => {
  try {
    const { title, author, category, skillLevel, tags } = req.query;
    const filter = {};

    if (title) filter.title = { $regex: title, $options: "i" };
    if (author) filter.author = { $regex: author, $options: "i" };
    if (category) filter.category = { $regex: category, $options: "i" };
    if (skillLevel) filter.skillLevel = { $regex: skillLevel, $options: "i" };
    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagsArray };
    }

    const books = await getBooksService(filter);
    res.status(200).json({
      success: true,
      total: books.length,
      data: books,
    });
  } catch (err) {
    errorResponse(res, err.message);
    next(err)
  }
};

export const postBooks = async (req, res, next) => {
  try {
    const { title, author, category, skillLevel, tags } = req.body;
    if (!title || !author || !category || !skillLevel || !tags) {
      return errorResponse(res, "Please fill in all fields");
    }

    const exists = await checkBookExistsService(title, author, category);
    if (exists) {
      return errorResponse(res, "Book is already in collection", 401);
    }

    const publishedBy = req.session.email;
    const book = await createBookService({
      title,
      author,
      category,
      skillLevel,
      tags,
      publishedBy,
    });
    const data = { id: book._id, title: book.title };
    successResponse(res, data);
  } catch (err) {
    errorResponse(res, "Something went wrong");
    next(err)
  }
};
