import {Link} from 'react-router-dom'

export const BookCard = ({book}) => {
    const {image, author, title, _id} = book;
    return (
        <div className='col-span-6 md:col-span-3 lg:col-span-2 '><Link to={`/catalog/${_id}`}>

            <div>
                <img src={image} alt='book image' className={'rounded-xl object-fit'}/>
            </div>

            <div className='my-3'>
                <p className={'text-[#707070] pb-1'}>{author}</p>
                <h2 className={'font-bold'}>{title}</h2>
            </div>

        </Link></div>


    )
}