import Books from '../models/booksModels.js';

export const getBooksService = async (filter) => {
  return Books.find(filter)
    .sort({ createdAt: -1 })
    .select('-_id -createdAt -updatedAt -__v -publishedBy');
};

export const createBookService = async (bookData) => {
  const book = new Books(bookData);
  return book.save();
};

export const checkBookExistsService = async (title, author, category) => {
  return Books.findOne({
    author: author.trim(),
    title: title.trim(),
    category: category.trim()
  });
};
