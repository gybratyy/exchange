import {Link} from 'react-router-dom'
import {typeDisplayNames} from "../lib/utils.js";

export const BookCard = ({book}) => {
    const {image, author, title, _id, type, price} = book;
    return (
        <div className='col-span-6 md:col-span-3 lg:col-span-2 '><Link to={`/catalog/${_id}`}>

            <div className='relative'>
                <div
                    className={`absolute top-2 right-2 px-2.5 py-1 text-xs font-semibold text-white rounded-full shadow-md ${
                        typeDisplayNames[type].bgColor}`}
                >
                    {typeDisplayNames[type].label || type} {type === 'forSale' && price ? `(${price} тг)` : ''}

                </div>
                <img src={image} alt='book image' className={'rounded-xl object-fit'}/>
            </div>

            <div className='my-3'>
                <p className={'text-[#707070] pb-1'}>{author}</p>
                <h2 className={'font-medium text-black'}>{title}</h2>
            </div>

        </Link></div>


    )
}