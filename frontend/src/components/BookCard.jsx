import {Link} from 'react-router-dom'
export const BookCard = ({book}) => {
    const { image, author, title, _id} = book;
    return(
        <Link to={`/catalog/${_id}` } >
            <div  className=''>
                <img src={image} alt='book image' className={'rounded-xl mb-2 w-full h-[80%] object-fill'}/>
                <div className='self-end'><p className={'text-[#707070]'}>{author}</p>
                    <h2 className={'font-bold'}>{title}</h2></div>
            </div>
        </Link>



    )
}