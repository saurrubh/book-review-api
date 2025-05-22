const Review = require('../models/Review');

// Create a review (one per user per book)
exports.createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const bookId = req.params.id;
  try {
    const review = await Review.create({
      user: req.userId,
      book: bookId,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update review (only by owner)
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.userId });
    if (!review) return res.status(404).json({ error: 'Review not found' });

    review.rating = req.body.rating;
    review.comment = req.body.comment;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete review (only by owner)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
