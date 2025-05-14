import {Link} from 'react-router-dom'
import {Button} from "@mui/material";
import {useBookStore} from "../store/useBookStore.js";

export const BookCardWithMarks = ({book, openModal}) => {
    const {image, author, title, _id, type} = book;
    const badgeStyles = {
        forSale: 'bg-green-500',
        forExchange: 'bg-blue-500',
        any: 'bg-yellow-500',
        forFree: 'bg-red-500',
    }
    const {getBookById} = useBookStore();

    const handleClick = () => {
        getBookById(_id);
        openModal();
    }
    return (

            <div className='w-[230px]'>
                <div className={'flex justify-end pe-4 '}> <div className={`rounded-t-lg text-white w-[35%] flex justify-center ${badgeStyles[type]}`}><span>{type}</span></div>  </div>

                <img src={image} alt={title} className={'rounded-xl mb-2 w-[230px] h-[320px] object-fill'}/>
                <p className={'text-[#707070]'}>{author}</p>
                <Link to={`/catalog/${_id}`}><h2 className={'font-bold hover:underline'}>{title}</h2></Link>
                <Button onClick={handleClick}>Edit</Button>
            </div>



    )
}