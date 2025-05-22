const Book = require('../models/Book');
const Review = require('../models/Review');

// Create a book
exports.createBook = async (req, res) => {
  try {
    const book = await Book.create({ ...req.body, createdBy: req.userId });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all books (with pagination and filters)
exports.getBooks = async (req, res) => {
  const { page = 1, limit = 10, author, genre } = req.query;
  const filter = {};
  if (author) filter.author = new RegExp(author, 'i');
  if (genre) filter.genre = genre;

  try {
    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get book by ID with average rating and reviews
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const reviews = await Review.find({ book: book._id });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

    res.json({
      ...book.toObject(),
      averageRating: avgRating.toFixed(2),
      reviews,
    });
  } catch (err) {
    res.status(404).json({ error: 'Book not found' });
  }
};

// Search books by title or author (partial match, case-insensitive)
exports.searchBooks = async (req, res) => {
  const { query } = req.query;
  const regex = new RegExp(query, 'i');
  try {
    const results = await Book.find({ $or: [{ title: regex }, { author: regex }] });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
