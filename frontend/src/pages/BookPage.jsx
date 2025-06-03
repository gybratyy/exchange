import {useParams} from 'react-router-dom';
import {useBookStore} from "../store/useBookStore.js";
import {useEffect} from "react";
import {ArrowDownUpIcon, Bookmark, EllipsisIcon} from "lucide-react";
import {BookExtra} from "../components/BookExtra.jsx";
import {StaticStarRating} from "../components/StaticStarRating.jsx";
import {useAuthStore} from "../store/useAuthStore.js";

const BookPage = () => {
    const { id } = useParams();
    const {getBookById, addView, book, isBookLoading} = useBookStore();
    const {authUser, toggleWishlist} = useAuthStore();

    useEffect(() => {
        addView(id)
            .then(() => getBookById(id))
            .catch((error) => console.error("Error fetching book:", error));
    }, [addView, getBookById, id, toggleWishlist]);



    return (
        <section className={'flex flex-col items-center max-w-[80%] justify-center pt-20 px-4 mx-auto'}>
            <div className='w-full grid grid-cols-12 gap-10 '>
                <div className='col-span-2 '>
                    <img  src={book.image} alt='book cover' className='rounded-xl'/>
                </div>
                <div className='col-span-8 '>
                    <p className={'text-[#707070] text-xl'}>{book.author}</p>
                    <h2 className={'font-bold text-5xl'}>{book.title}</h2>
                    <div className='pt-4 flex gap-4'>
                        <button className="btn rounded-[20px] px-4 ">
                            <ArrowDownUpIcon/>
                            Обменять
                        </button>
                        <button className="btn rounded-[20px] px-3 " onClick={() => toggleWishlist(book._id)}>
                            <Bookmark
                                color={authUser.wishlist && authUser.wishlist.includes(book._id) ? '#408ACF' : 'currentColor'}/>
                        </button>
                        <button className="btn rounded-[20px] px-3 ">
                            <EllipsisIcon/>
                        </button>
                    </div>
                    <p className='pt-4 text-black text-base text-justify'>{book.description}</p>
                    <div className='pt-8 flex flex-wrap gap-4'>
                        {book?.categories?.map((c, index) => (
                            <button key={index} className="btn btn-outline  rounded-[12px] px-4 ">
                                {c.name}
                            </button>
                        ))}


                    </div>






                </div>
                <div className='col-span-2  '>
                    <p className={'text-[#707070] text-xl'}>Рейтинг</p>
                    <StaticStarRating maxStars={5} rating={4} />

                </div>
            </div>
            <div className='w-full grid grid-cols-12 gap-10 '>
                <div className='col-span-2 '></div>
                <div className='col-span-8 '>
                  <BookExtra />
                </div>

            </div>
        </section>
    )
}

export default BookPage;


