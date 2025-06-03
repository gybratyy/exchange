import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import {useBookStore} from '../store/useBookStore';
import {useExchangeStore} from '../store/useExchangeStore';
import {useAuthStore} from '../store/useAuthStore';
import {Loader2, X} from 'lucide-react';


const CompactBookCard = ({book, onSelect, isSelected, disabled}) => {
    return (
        <button
            onClick={() => onSelect(book)}
            disabled={disabled}
            className={`
                w-full p-3 mb-2 border rounded-lg flex items-center gap-3 text-left transition-all
                ${isSelected ? 'border-primary ring-2 ring-primary bg-primary/10' : 'border-base-300 hover:bg-base-200'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <img src={book.image || '/placeholder-book.png'} alt={book.title}
                 className="w-12 h-16 object-cover rounded"/>
            <div className="flex-grow">
                <h4 className="font-semibold text-sm truncate">{book.title}</h4>
                <p className="text-xs text-base-content/70 truncate">{book.author}</p>
            </div>
        </button>
    );
};


const ExchangeModal = ({isOpen, onClose, targetBook}) => {
    const navigate = useNavigate();
    const {authUser} = useAuthStore();
    const {myBooks, getMyBooks, isBooksLoading: isMyBooksLoading} = useBookStore();
    const {
        initiateExchange,
        isLoadingInitiate,
        clearExchangeProposalFlow
    } = useExchangeStore();

    const [selectedOwnBook, setSelectedOwnBook] = useState(null);

    useEffect(() => {
        if (isOpen && authUser) {
            getMyBooks();
        }
    }, [isOpen, authUser, getMyBooks]);

    const handleSelectOwnBook = (book) => {
        setSelectedOwnBook(book);
    };

    const handleInitiateExchange = async () => {
        if (!selectedOwnBook || !targetBook) {
            toast.error("Please select a book to offer.");
            return;
        }
        try {
            const newExchange = await initiateExchange(targetBook._id, selectedOwnBook._id);
            if (newExchange && newExchange.receiverUser) {
                toast.success("Предложение обмена создано! Перенаправляем в чат...");
                navigate(`/chat`, {
                    state: {
                        preselectedUserId: newExchange.receiverUser._id,
                        exchangeId: newExchange._id
                    }
                });
                handleClose();
            }
        } catch (error) {
            console.error("Failed to initiate exchange from modal:", error);
        }
    };

    const handleClose = () => {
        setSelectedOwnBook(null);
        clearExchangeProposalFlow();
        onClose();
    };

    if (!isOpen) return null;

    const availableBooksToOffer = myBooks.filter(
        book => book._id !== targetBook._id &&
            (book.type === "forExchange" || book.type === "any") &&
            book.status === "available" &&
            book.isActive
    );


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
            onClick={handleClose}
        >
            <div
                className="bg-base-100 rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-base-300">
                    <h3 className="text-xl font-semibold">
                        Обменять <span className="text-primary font-bold">{targetBook.title}</span> на...
                    </h3>
                    <button onClick={handleClose} className="btn btn-sm btn-ghost btn-circle">
                        <X size={20}/>
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto pr-2 -mr-2 mb-4">
                    {isMyBooksLoading &&
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin"/></div>}
                    {!isMyBooksLoading && availableBooksToOffer.length === 0 && (
                        <p className="text-center text-base-content/70 py-4">
                            У вас нет доступных книг для обмена.
                        </p>
                    )}
                    {!isMyBooksLoading && availableBooksToOffer.map((book) => (
                        <CompactBookCard
                            key={book._id}
                            book={book}
                            onSelect={handleSelectOwnBook}
                            isSelected={selectedOwnBook?._id === book._id}
                            disabled={isLoadingInitiate}
                        />
                    ))}
                </div>

                <div className="pt-4 border-t border-base-300 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="btn btn-ghost"
                        disabled={isLoadingInitiate}
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleInitiateExchange}
                        className="btn btn-primary"
                        disabled={!selectedOwnBook || isLoadingInitiate}
                    >
                        {isLoadingInitiate ? <Loader2 className="animate-spin mr-2"/> : null}
                        Предложить обмен
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExchangeModal;