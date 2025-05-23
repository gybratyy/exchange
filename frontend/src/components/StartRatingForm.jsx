import React, { useState, useEffect } from 'react';
import { Star as StarIcon, Send } from 'lucide-react'; // Using lucide-react for icons
import { useBookStore } from '../store/useBookStore'; // To call addRating
import { useAuthStore } from '../store/useAuthStore'; // To get current user for initial rating
import toast from 'react-hot-toast';


export const StarRatingForm = ({ bookId, initialUserRating = 0, onRatingSubmit }) => {
    const [currentRating, setCurrentRating] = useState(initialUserRating);
    const [hoverRating, setHoverRating] = useState(0);
    const [hasSelectedRating, setHasSelectedRating] = useState(false); // To show submit button
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { addRating: storeAddRating, getBookById } = useBookStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
        setCurrentRating(initialUserRating);
        if (initialUserRating > 0) {
            // No need to immediately show submit button on load unless they change it
            // setHasSelectedRating(true);
        }
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
            toast.error("Пожалуйста, выберите оценку.");
            return;
        }
        setIsSubmitting(true);
        try {

            await storeAddRating(bookId, currentRating);
            toast.success(`Оценка ${currentRating} звезд успешно отправлена!`);
            if (onRatingSubmit) {
                onRatingSubmit(currentRating);
            }

            await getBookById(bookId);
            setHasSelectedRating(false);
        } catch (error) {
            toast.error("Не удалось отправить оценку. Попробуйте еще раз.");
            console.error("Error submitting rating:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-base-100  flex align-baseline">
            <div className="flex items-center  mb-4">
                {[1, 2, 3, 4, 5].map((starValue) => (
                    <StarIcon
                        key={starValue}
                        size={28}
                        className={`cursor-pointer transition-colors duration-150 ease-in-out
              ${(hoverRating || currentRating) >= starValue ? 'text-yellow-400 fill-yellow-400' : 'text-base-content/30'}
            `}
                        onClick={() => handleStarClick(starValue)}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}

            </div>

            {hasSelectedRating && currentRating > 0 && (
                <button
                    onClick={handleSubmit}
                    className="btn  bg-[#2e3440] btn-sm normal-case rounded-lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Отправка...
                        </>
                    ) : (

                            <Send size={16} className="mr-2" color='white' />

                    )}
                </button>
            )}
            {initialUserRating > 0 && !hasSelectedRating && (
                <p className="text-sm text-base-content/70 mt-2">Ваша текущая оценка: {initialUserRating} звезд. Нажмите на звезду, чтобы изменить.</p>
            )}
        </div>
    );
};

