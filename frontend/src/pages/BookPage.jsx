import {Link, useNavigate, useParams} from 'react-router-dom';
import {useBookStore} from "../store/useBookStore.js";
import {useEffect, useState} from "react";
import {ArrowDownUpIcon, Bookmark, Loader2, MessageSquare, Flag} from "lucide-react";
import {BookExtra} from "../components/BookExtra.jsx";
import {StaticStarRating} from "../components/StaticStarRating.jsx";
import {useAuthStore} from "../store/useAuthStore.js";
import {useExchangeStore} from '../store/useExchangeStore.js';
import ExchangeModal from '../components/ExchangeModal.jsx';
import toast from 'react-hot-toast';
import ReportModal from "../components/ReportModal.jsx";

const BookPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {getBookById, addView, book, isBookLoading} = useBookStore();
    const {myBooks, getMyBooks} = useBookStore();
    const {authUser, toggleWishlist, isCheckingAuth} = useAuthStore();
    const {setTargetBookForExchange, isLoadingInitiate} = useExchangeStore();

    const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            addView(id)
                .then(() => getBookById(id))
                .catch((error) => console.error("Error fetching book:", error));
        }

    }, [id, getBookById, addView, authUser]);

    const handleOpenExchangeModal = () => {
        if (!authUser) {
            toast.error("Пожалуйста, войдите в систему, чтобы предложить обмен.");
            navigate("/login");
            return;
        }
        getMyBooks()
        console.log(myBooks)
        setTargetBookForExchange(book);
        setIsExchangeModalOpen(true);
    };

    const canExchange = authUser && book && authUser._id !== book.owner?._id &&
        (book.type === "forExchange" || book.type === "any") &&
        book.status === "available" && book.isActive;

    if (isBookLoading || isCheckingAuth) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="size-10 animate-spin"/>
            </div>
        );
    }

    if (!book || Object.keys(book).length === 0) {
        return (
            <div className="flex items-center justify-center h-screen pt-20">
                <p>Книга не найдена или загружается...</p>
            </div>
        );
    }

    const averageRating = book.reviews && book.reviews.length > 0
        ? book.reviews.reduce((acc, review) => acc + review.rating, 0) / book.reviews.length
        : 0;

    return (
        <>
            <section className={'flex flex-col items-center max-w-[80%] justify-center pt-20 px-4 mx-auto'}>
                <div className='w-full grid grid-cols-12 gap-10 '>
                    <div className='col-span-3 '> {/* Adjusted from col-span-2 */}
                        <img
                            src={book.image || `https://placehold.co/300x450/E2E8F0/4A5568?text=${encodeURIComponent(book.title || 'Книга')}&font=lora`}
                            alt={book.title || 'book cover'}
                            className='rounded-xl w-full aspect-[2/3] object-cover shadow-lg'/>
                    </div>
                    <div className='col-span-7 '> {/* Adjusted from col-span-8 */}
                        <p className={'text-gray-600 text-lg'}>{book.author}</p>
                        <h1 className={'font-bold text-4xl mb-3'}>{book.title}</h1>

                        <div className="flex items-center mb-4">
                            <StaticStarRating rating={averageRating} maxStars={5}/>
                            <span className="ml-2 text-gray-600 text-sm">
                                ({book.reviews?.length || 0} {book.reviews?.length === 1 ? "отзыв" : "отзывов"})
                            </span>
                        </div>

                        <div className='pt-4 flex items-center gap-3'>
                            {canExchange && (
                                <button
                                    onClick={handleOpenExchangeModal}
                                    className="btn btn-primary rounded-[20px] px-4 flex items-center gap-2"
                                    disabled={isLoadingInitiate}
                                >
                                    {isLoadingInitiate ? <Loader2 className="animate-spin size-4"/> :
                                        <ArrowDownUpIcon size={18}/>}
                                    Обменять
                                </button>
                            )}

                            {authUser && book.owner?._id !== authUser._id && (
                                <button
                                    onClick={() => navigate(`/chat`, {state: {preselectedUserId: book.owner?._id}})}
                                    className="btn btn-outline rounded-[20px] px-4 flex items-center gap-2"
                                >
                                    <MessageSquare size={18}/> Написать владельцу
                                </button>
                            )}

                            {authUser && (
                                <button
                                    className="btn btn-ghost btn-circle rounded-[20px] px-3 "
                                    onClick={() => toggleWishlist(book._id)}
                                    title={authUser.wishlist?.some(item => item === book._id || item._id === book._id) ? "Убрать из желаемого" : "Добавить в желаемое"}
                                >
                                    <Bookmark
                                        size={20}
                                        fill={authUser.wishlist?.some(item => item === book._id || item._id === book._id) ? 'currentColor' : 'none'}
                                        className={authUser.wishlist?.some(item => item === book._id || item._id === book._id) ? 'text-primary' : 'text-gray-500'}
                                    />
                                </button>
                            )}
                            {authUser && book.owner?._id !== authUser._id && (
                                <button
                                    onClick={() => setIsReportModalOpen(true)}
                                    className="btn btn-ghost btn-circle text-error"
                                    title="Report this item"
                                >
                                    <Flag size={20}/>
                                </button>
                            )}
                        </div>

                        <p className='pt-6 text-gray-700 text-base text-justify leading-relaxed'>{book.description}</p>

                        <div className='pt-8 flex flex-wrap gap-3'>
                            {book?.categories?.map((c) => (
                                <span key={c._id || c.name} className="badge badge-outline badge-lg p-3">
                                    {c.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className='col-span-2 flex flex-col items-start'>
                        <h3 className="text-lg font-semibold mb-1">Владелец:</h3>
                        <Link to={`/user/${book.owner?._id}`} className="flex items-center gap-2 mb-4 hover:opacity-80">
                            <img
                                src={book.owner?.profilePic || '/avatar.png'}
                                alt={book.owner?.fullName || 'owner'}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="font-medium">{book.owner?.fullName || 'Неизвестно'}</span>
                        </Link>
                        {book.owner?.city && book.owner?.country && (
                            <p className="text-sm text-gray-500">📍 {book.owner.city}, {book.owner.country}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">Тип: <span
                            className={`font-semibold ${book.type === 'forSale' ? 'text-green-600' : book.type === 'forExchange' ? 'text-blue-600' : book.type === 'forFree' ? 'text-red-600' : 'text-purple-600'}`}>
                            {book.type === 'forSale' ? `Продажа (${book.price} тг)` : book.type === 'forExchange' ? 'Обмен' : book.type === 'forFree' ? 'Бесплатно' : 'Продажа/Обмен'}
                         </span></p>
                        <p className="text-sm text-gray-500 mt-1">Статус: <span
                            className={`font-semibold ${book.status === 'available' ? 'text-green-600' : 'text-orange-500'}`}>{book.status.replace('_', ' ')}</span>
                        </p>
                    </div>
                </div>
                <div className='w-full grid grid-cols-12 gap-10 mt-10 mb-10'>
                    <div className='col-span-1 md:col-span-3'></div>
                    <div className='col-span-10 md:col-span-7'>
                        <BookExtra/>
                    </div>
                </div>
            </section>
            {isExchangeModalOpen && book && (
                <ExchangeModal
                    isOpen={isExchangeModalOpen}
                    onClose={() => setIsExchangeModalOpen(false)}
                    targetBook={book}
                />
            )}
            {isReportModalOpen && (
                <ReportModal
                    resourceId={book._id}
                    resourceType="Book"
                    onClose={() => setIsReportModalOpen(false)}
                />
            )}
        </>
    );
};

export default BookPage;