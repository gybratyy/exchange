import {StaticStarRating} from "./StaticStarRating.jsx";
import {MoreHorizontal} from "lucide-react";

export const ReviewItem = ({review}) => {
    return (
        <div className="flex items-start gap-4 py-4">
            <img
                src={review.profilePic || 'https://www.w3schools.com/howto/img_avatar.png'}
                alt={review.fullName}
                className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">{review.fullName}</p>
                        <p className="text-xs text-base-content/60">
                            {new Date(review.createdAt || Date.now()).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                    <StaticStarRating rating={review.rating}/>
                </div>
                <p className="mt-2 text-base-content/90">{review.text}</p>
                <div className="mt-2 flex items-center gap-4">
                    <button className="text-sm font-medium text-base-content/70 hover:text-primary">Ответить</button>
                    <button className="text-base-content/50 hover:text-primary">
                        <MoreHorizontal size={20}/>
                    </button>
                </div>
            </div>
        </div>
    );
};
