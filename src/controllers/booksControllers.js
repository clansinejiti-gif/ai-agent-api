import Books from '../models/booksModels.js'
import { errorResponse, successResponse } from '../utils/responseFormatter.js';

export const getBooks = async (req, res) => {
  try {
    const { title, author, category, skillLevel, tags } = req.query;

    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    if (author) {
      filter.author = { $regex: author, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (skillLevel) {
      filter.skillLevel = { $regex: skillLevel, $options: "i" };
    }

    if (tags) {
      // Allow comma-separated tags: ?tags=javascript,nodejs,react
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagsArray };
    }

    const books = await Books.find(filter).sort({ createdAt: -1 }).select('-_id -createdAt -updatedAt -__v');

    res.status(200).json({
      success: true,
      total: books.length,
      data: books
    });
  } catch (error) {
    errorResponse(res, error.message )
    // res.status(500).json({
    //   success: false,
    //   message: "Server Error",
    //   error: error.message,
    // });
  }
};

export const postBooks = async (req, res) => {
    try{
    const { title, author, category, skillLevel, tags } = req.body;
    if(!title || !author || !category || !skillLevel || !tags) {
        errorResponse(res, "Please fill in all fields", )
    }
    const findIfExists = await Books.findOne({
      author: author.trim(),
      title: title.trim(),
      category: category.trim()
    });
    if(findIfExists){
        return res.status(401).json({ 
            success: false,
            message: "Book is already in collection"
        });
    }
    const createBook = await new Books({
        title,
        author,
        category,
        skillLevel,
        tags
    }).save();

    const data = {id: createBook._id, title: createBook.title}
    successResponse(res, data)
} catch(err){
    errorResponse(res, 'Something went wrong');
}
}


