import {Link} from 'react-router-dom'
import {Button} from "@mui/material"; // Assuming you're using Material UI Button, adjust if not.
import {useBookStore} from "../store/useBookStore.js";

export const BookCardWithMarks = ({book, openModal}) => {
    const {image, author, title, _id, type} = book;

    // Define badge styles based on book type
    const badgeStyles = {
        forSale: 'bg-green-500',
        forExchange: 'bg-blue-500',
        any: 'bg-yellow-500', // Or any other color for "any"
        forFree: 'bg-red-500',
    };
    const typeDisplayNames = {
        forSale: 'For Sale',
        forExchange: 'For Exchange',
        any: 'Exchange/Sale',
        forFree: 'For Free',
    };

    const {getBookById} = useBookStore();

    const handleClick = () => {
        getBookById(_id);
        openModal();
    };

    return (
        <div className='w-full grid grid-rows-12'>
            <div className='relative mb-2 row-span-8'>
                <img
                    src={image || 'https://via.placeholder.com/230x320?text=No+Image'}
                    alt={title}
                    className={'rounded-xl w-full h-full object-fit'}
                />
                {type && (
                    <div
                        className={`absolute top-2 right-2 ${badgeStyles[type] || 'bg-gray-500'} text-white text-xs font-semibold px-2 py-1 rounded shadow-md`}
                    >
                        <span>{typeDisplayNames[type] || type}</span>
                    </div>
                )}
            </div>

            <div className="row-span-2">
                <div>
                    <p className={'text-[#707070] text-sm truncate mb-1'}>{author}</p>
                    <Link to={`/catalog/${_id}`} className="">
                        <h2 className={'font-bold text-base hover:underline line-clamp-2 '}>
                            {title}
                        </h2>
                    </Link>
                </div>

            </div>
            <div className="row-span-2">
                <Button onClick={handleClick} variant="outlined" size="small" fullWidth>
                    Edit
                </Button>
            </div>
        </div>
    );
};