import {MessageSquare, PlusIcon, X} from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useBookStore} from "../store/useBookStore.js";
import {BookCardWithMarks} from "../components/BookCardWithMarks.jsx";
import {BookForm} from "../components/BookForm.jsx";
import {useAuthStore} from "../store/useAuthStore.js";
import {useExchangeStore} from "../store/useExchangeStore.js";

const ExchangePage = () => {
    const [activeTab, setActiveTab] = useState('myBooks');
    const {myBooks, getMyBooks, resetBook, getCategories, books: allBooksFromStore} = useBookStore();
    const {authUser, checkAuth} = useAuthStore();
    const {userExchanges, fetchUserExchanges, isLoadingUserExchanges} = useExchangeStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        if (authUser) {
            getMyBooks();
            getCategories();
            fetchUserExchanges();
        } else {
            checkAuth();
        }
    }, [authUser, getMyBooks, getCategories, fetchUserExchanges, checkAuth]);


    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        resetBook();
    };

    const handleCreateBook = () => {
        resetBook();
        openModal();
    };

    const ExchangeItemCard = ({exchange}) => {
        if (!authUser || !exchange.initiatorUser || !exchange.receiverUser || !exchange.initiatorBook || !exchange.receiverBook) {
            return <div className="p-3 border rounded-lg bg-error/10 text-error-content">Неполные данные обмена</div>;
        }
        const isAuthUserInitiator = exchange.initiatorUser._id === authUser._id;
        const otherUser = isAuthUserInitiator ? exchange.receiverUser : exchange.initiatorUser;
        const myOfferedBook = isAuthUserInitiator ? exchange.initiatorBook : exchange.receiverBook;
        const theirOfferedBook = isAuthUserInitiator ? exchange.receiverBook : exchange.initiatorBook;

        return (
            <div
                className="p-4 border border-base-300 rounded-lg shadow-md bg-base-100 hover:shadow-lg transition-shadow col-span-1">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-grow">
                        <p className="text-xs text-base-content/70">
                            Обмен с: <span className="font-semibold">{otherUser.fullName}</span>
                        </p>
                        <div className="text-sm mt-1">
                            Вы предлагаете: <span className="font-medium">{myOfferedBook.title}</span>
                        </div>
                        <div className="text-sm">
                            Вам предлагают: <span className="font-medium">{theirOfferedBook.title}</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                        <span className={`badge badge-sm ${
                            exchange.status === 'completed' ? 'badge-success' :
                                exchange.status.startsWith('cancelled') || exchange.status === 'declined' ? 'badge-error' :
                                    exchange.status === 'agreed_pending_confirmation' ? 'badge-info' :
                                        'badge-warning'
                        }`}>
                            {exchange.status.replace(/_/g, ' ')}
                        </span>
                        <p className="text-xs text-base-content/60 mt-1">
                            {new Date(exchange.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <button
                        className="btn btn-sm btn-outline btn-primary flex items-center gap-1"
                        onClick={() => navigate('/chat', {
                            state: {
                                preselectedUserId: otherUser._id,
                                exchangeId: exchange._id
                            }
                        })}
                    >
                        <MessageSquare size={14}/> Перейти в чат
                    </button>
                </div>
            </div>
        );
    };


    const TABS_CONTENT = {
        myBooks: (
            <section className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4 mx-auto'}>
                {myBooks.length > 0 ? myBooks.map((book) => (
                    <BookCardWithMarks key={book._id} book={book} openModal={openModal}/>
                )) : <p className="col-span-full text-center p-4">У вас нет добавленных книг.</p>}
            </section>
        ),
        wishlist: (
            <section className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4 mx-auto'}>
                {authUser?.wishlist && authUser.wishlist.length > 0 ? authUser.wishlist.map((book) => (
                    <BookCardWithMarks key={book._id} book={book} openModal={openModal} compact/>
                )) : <p className="col-span-full text-center p-4">Ваш список желаемого пуст.</p>}
            </section>
        ),
        myExchanges: (
            <section className={'grid grid-cols-1 md:grid-cols-2 gap-4 pt-4'}>
                {isLoadingUserExchanges && <p className="col-span-full text-center p-4">Загрузка обменов...</p>}
                {!isLoadingUserExchanges && userExchanges.length === 0 && (
                    <p className="col-span-full text-center p-4">У вас нет активных или завершенных обменов.</p>
                )}
                {!isLoadingUserExchanges && userExchanges.map((exchange) => (
                    <ExchangeItemCard key={exchange._id} exchange={exchange}/>
                ))}
            </section>
        )
    };

    return (
        <section className='pt-20 w-[90%] md:w-[80%] mx-auto pb-10'>
            <div className='flex flex-col sm:flex-row justify-between items-center mb-6'>
                <h1 className='text-3xl md:text-4xl font-semibold text-gray-800'>Книгообмен</h1>
                <div className='pt-4 sm:pt-0 flex gap-2 sm:gap-4'>
                    <button onClick={handleCreateBook}
                            className="btn btn-primary rounded-lg px-3 flex items-center gap-1 text-sm">
                        <PlusIcon size={18}/> Добавить книгу
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-12 gap-6'>
                <div className='col-span-12 md:col-span-3'>
                    <div className='flex flex-col gap-3 pt-2 sticky top-20 bg-base-100 p-4 rounded-lg shadow'>
                        <button
                            className={`btn justify-start text-left ${activeTab === "myBooks" ? "btn-active btn-primary" : "btn-ghost"}`}
                            onClick={() => setActiveTab('myBooks')}>
                            Мои книги ({myBooks?.length || 0})
                        </button>
                        <button
                            className={`btn justify-start text-left ${activeTab === "wishlist" ? "btn-active btn-primary" : "btn-ghost"}`}
                            onClick={() => setActiveTab('wishlist')}>
                            Список желаний ({authUser?.wishlist?.length || 0})
                        </button>
                        <button
                            className={`btn justify-start text-left ${activeTab === "myExchanges" ? "btn-active btn-primary" : "btn-ghost"}`}
                            onClick={() => setActiveTab('myExchanges')}>
                            Мои обмены ({userExchanges?.length || 0})
                        </button>
                    </div>
                </div>

                <div className='col-span-12 md:col-span-9'>
                    {TABS_CONTENT[activeTab]}
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-[100] bg-black/50 p-4"
                    onClick={closeModal}
                >
                    <div
                        className="relative bg-base-100 py-6 rounded-xl shadow-xl z-[101] max-h-[90vh] w-full max-w-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex w-full justify-between items-center mb-4 px-6 md:px-8">

                            <button
                                onClick={closeModal}
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                <X size={20}/>
                            </button>
                        </div>
                        <div className="overflow-y-auto px-6 md:px-8 pb-6">
                            <BookForm closeModal={closeModal}/>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ExchangePage;