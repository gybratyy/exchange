import {Link} from 'react-router-dom'
export const BookCard = ({book}) => {
    const { image, author, title, _id} = book;
    return(
        <Link to={`/catalog/${_id}` }><div  className=''>
            <img src={image[0]} className={'rounded-xl mb-2 w-[230px] h-[320px] object-fill'}/>
            <p className={'text-[#707070]'}>{author}</p>
            <h2 className={'font-bold'}>{title}</h2>
        </div></Link>



    )
}