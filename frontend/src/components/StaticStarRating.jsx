import {StarIcon} from "lucide-react";

export const StaticStarRating = ({
                                     rating = 0,
                                     maxStars = 5,
                                     size = 'h-5 w-5', // Default size, equivalent to lucide's default size={20}
                                     filledColor = 'text-yellow-400 fill-yellow-400',
                                     emptyColor = 'text-base-content/30',
                                     className = '',
                                 }) => {
    const roundedRating = Math.round(rating * 2) / 2; // Rounds to nearest 0.5 for potential half-star logic if needed, but we'll use full stars

    return (
        <div className={`flex items-center space-x-0.5 ${className}`}>
            {[...Array(maxStars)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <StarIcon
                        key={index}
                        className={`${size} ${starValue <= roundedRating ? filledColor : emptyColor}`}
                    />
                );
            })}
        </div>
    );
};
