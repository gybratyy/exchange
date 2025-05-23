import React, { useState } from 'react';
import {StarRatingForm} from "./StarRatingForm.jsx";
import {useBookStore} from "../store/useBookStore.js";
// ... other imports

function ReviewForm({ bookId}) {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const { addReview } = useBookStore(); // Assuming you have a function to add reviews

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleTextChange = (event) => {
        setReviewText(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Basic validation (optional but recommended)
        if (rating === 0 || reviewText.trim() === '') {
            alert('Please provide a rating and a review.');
            return;
        }
        addReview({ bookId, text: reviewText, rating });
        setRating(0);
        setReviewText('');
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h3>Leave a Review</h3>
            <div>
                 <StarRatingForm currentRating={rating} onRate={handleRatingChange} />

            </div>
            <div>
                <label htmlFor="reviewText">Your Review:</label>
                <textarea
                    id="reviewText"
                    value={reviewText}
                    onChange={handleTextChange}
                    rows="4"
                    cols="50"
                    required
                />
            </div>
            <button type="submit">Submit Review</button>
        </form>
    );
}

export default ReviewForm;