import {useBookStore} from "../store/useBookStore.js";
import {useEffect, useMemo, useState} from "react";
import {BookCard} from "./BookCard.jsx";
import {ReviewItem} from "./ReviewItem.jsx";
import {useParams} from "react-router-dom";
import {StaticStarRating} from "./StaticStarRating.jsx";
import {StarRatingForm} from "./StarRatingForm.jsx";
import {StarIcon} from "lucide-react";


export const BookExtra = () => {
    const {similarBooks, getSimilarBooks, book} = useBookStore();
    const {id} = useParams();
    const [activeTab, setActiveTab] = useState('reviews');
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        if (activeTab === 'similarBooks') {
            getSimilarBooks(id);
        }
    }, [id, getSimilarBooks, activeTab]);

    const {averageRating, totalReviews, ratingDistribution} = useMemo(() => {
        const reviews = book?.reviews || [];
        if (reviews.length === 0) {
            return {averageRating: 0, totalReviews: 0, ratingDistribution: {}};
        }
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        const distribution = reviews.reduce((acc, review) => {
            acc[review.rating] = (acc[review.rating] || 0) + 1;
            return acc;
        }, {});

        return {
            averageRating: total / reviews.length,
            totalReviews: reviews.length,
            ratingDistribution: distribution,
        };
    }, [book?.reviews]);

    const TABS = {
        similarBooks: (
            <section className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4 mx-auto'}>
                {similarBooks.map((book) => (
                    <BookCard key={book._id} book={book}/>
                ))}
            </section>
        ),
        reviews: (
            <section>
                <div className="flex justify-between gap-4 align-start">
                    {/* Left side: Rating Summary */}
                    <div className="">
                        <h3 className="text-lg font-bold mb-2">Рейтинг книги</h3>
                        <div className="flex-col items-center justify-center gap-2">
                            <StaticStarRating rating={averageRating}/>

                            <p className="text-4xl font-bold">{averageRating.toFixed(1)}
                                <span className="text-2xl text-base-content/50">/5</span>
                            </p>
                            <p className="text-sm text-base-content/60">{totalReviews} отзыва</p>
                        </div>


                    </div>
                    {/* col 2, rating lines */}
                    <div className="w-1/2">
                        {[5, 4, 3, 2, 1].map(star => {
                            const count = ratingDistribution[star] || 0;
                            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-2 text-sm">
                                    <span className='flex items-center gap-2'>{star} <StarIcon
                                        className='h-4 w-4 text-yellow-400 fill-yellow-400'/></span>
                                    <div className="w-full bg-base-200 rounded-full h-2">
                                        <div className="bg-amber-400 h-2 rounded-full"
                                             style={{width: `${percentage}%`}}></div>
                                    </div>
                                    <span className="w-8 text-right text-base-content/60">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="">
                        <button className="btn btn-outline rounded-lg"
                                onClick={() => setShowReviewForm(!showReviewForm)}>
                            Добавить отзыв
                        </button>
                    </div>
                </div>

                {/* Review Form (Modal or inline) */}
                {showReviewForm && (
                    <div className="my-6 p-4 border rounded-lg bg-base-200">
                        <StarRatingForm
                            bookId={book._id}
                            onReviewSubmitted={() => setShowReviewForm(false)}
                        />
                    </div>
                )}

                {/* Reviews List */}
                <div className="divide-y divide-base-200">
                    {book?.reviews?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((review) => (
                        <ReviewItem key={review._id} review={review}/>
                    ))}
                </div>
            </section>
        ),
    };

    return (
        <>
            <div className='pt-8 flex flex-wrap gap-4'>
                <button
                    className={`btn btn-outline rounded-[12px] px-4 ${activeTab === "reviews" ? "btn-active" : ""}`}
                    onClick={() => setActiveTab('reviews')}>
                    Отзывы
                </button>
                <button
                    className={`btn btn-outline rounded-[12px] px-4 ${activeTab === "similarBooks" ? "btn-active" : ""}`}
                    onClick={() => setActiveTab('similarBooks')}>
                    Похожие книги
                </button>
            </div>
            <div className='pt-2'>
                {TABS[activeTab]}
            </div>
        </>
    );
};