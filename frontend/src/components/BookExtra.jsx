import {useBookStore} from "../store/useBookStore.js";
import {useEffect, useState} from "react";
import {BookCard} from "./BookCard.jsx";
import {useParams} from "react-router-dom";
import {StaticStarRating} from "./StaticStarRating.jsx";
import {StarRatingForm} from "./StarRatingForm.jsx";


export const BookExtra = () => {
    const {similarBooks, books, book, getBookById} = useBookStore()

    const {id} = useParams();

    useEffect(() => {
        getBookById(id)
    }, [getBookById, id, books]);


    const [activeTab, setActiveTab] = useState('similarBooks')
    const TABS = {
        similarBooks: (
            <section className={'grid grid-cols-8 gap-6 pt-4 mx-auto'}>
                {
                    similarBooks.map((book) => {
                        return (
                            <BookCard key={book._id} book={book}/>
                        )
                    })

                }
            </section>
        ),
        reviews: (<section>
            <StarRatingForm bookId={book._id}/>

            {
                book?.reviews?.map((review, index) => {
                    return (
                        <div key={index} className={'flex justify-between pt-4'}>
                            <><img src={review.profilePic || 'https://www.w3schools.com/howto/img_avatar.png'}
                                         alt="profile" className={'rounded-full w-[50px] h-[50px]'}/>
                            <div>
                                <p className={'text-[#707070] text-xl'}>{review.fullName}</p>
                                <p className={'text-black text-base text-justify'}>{review.text}</p>
                            </div></>
                            <StaticStarRating rating={review.rating} maxStars={5}/>
                        </div>

                    )
                })
            }


        </section>),
    }
    return (
        <>
            <div className='pt-8 flex flex-wrap gap-4'>

                <button
                    className={`btn btn-outline  rounded-[12px] px-4 ${activeTab === "similarBooks" ? "btn-active" : ""}`}
                    onClick={() => setActiveTab('similarBooks')}>
                    Похожие книги
                </button>
                <button
                    className={`btn btn-outline  rounded-[12px] px-4 ${activeTab === "reviews" ? "btn-active" : ""}`}
                    onClick={() => setActiveTab('reviews')}>
                    Отзывы
                </button>


            </div>
            <div className='pt-8'>
                {TABS[activeTab]}
            </div>
        </>
    )
}