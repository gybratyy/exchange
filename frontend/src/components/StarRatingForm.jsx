import  { useState, useEffect } from 'react';
import { Star as StarIcon, Send } from 'lucide-react';
import { useBookStore } from '../store/useBookStore';
import toast from 'react-hot-toast';
import { TextField } from '@mui/material';

export const StarRatingForm = ({ bookId, initialUserRating = 0, onRatingSubmit }) => {
    const [currentRating, setCurrentRating] = useState(initialUserRating);
    const [hoverRating, setHoverRating] = useState(0);
    const [hasSelectedRating, setHasSelectedRating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [text, setText] = useState('');

    const { addReview, getBookById } = useBookStore();

    useEffect(() => {
        setCurrentRating(initialUserRating);
    }, [initialUserRating]);

    const handleStarClick = (ratingValue) => {
        setCurrentRating(ratingValue);
        setHasSelectedRating(true);
    };

    const handleMouseEnter = (ratingValue) => {
        setHoverRating(ratingValue);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleSubmit = async () => {
        if (currentRating === 0) {
            toast.error('Please select a rating.');
            return;
        }
        if (!text.trim()) {
            toast.error('Please enter a review text.');
            return;
        }
        setIsSubmitting(true);
        try {
            await addReview(bookId, text, currentRating);
            toast.success('Review submitted successfully!');
            if (onRatingSubmit) {
                onRatingSubmit(currentRating);
            }
            await getBookById(bookId);
            setText('');
            setHasSelectedRating(false);
        } catch (error) {
            toast.error('Failed to submit review. Please try again.');
            console.error('Error submitting review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-base-100 flex flex-col gap-4">
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((starValue) => (
                    <StarIcon
                        key={starValue}
                        size={28}
                        className={`cursor-pointer transition-colors duration-150 ease-in-out ${
                            (hoverRating || currentRating) >= starValue
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-base-content/30'
                        }`}
                        onClick={() => handleStarClick(starValue)}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}
            </div>
            <TextField
                label="Write your review"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            {hasSelectedRating && currentRating > 0 && (
                <button
                    onClick={handleSubmit}
                    className="btn bg-[#2e3440] btn-sm normal-case rounded-lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={16} className="mr-2" color="white" />
                            Submit
                        </>
                    )}
                </button>
            )}
        </div>
    );
};