import {Link} from 'react-router-dom'

export const BookCardWithMarks = ({book}) => {
    const {image, author, title, _id, type} = book;
    const badgeStyles = {
        forSale: 'bg-green-500',
        forExchange: 'bg-blue-500',
        any: 'bg-yellow-500',
        forFree: 'bg-red-500',
    }
    return (
        <Link to={`/catalog/${_id}`}>
            <div className='w-[230px]'>
                <div className={'flex justify-end pe-4 '}> <div className={`rounded-t-lg text-white w-[35%] flex justify-center ${badgeStyles[type]}`}><span>{type}</span></div>  </div>

                <img src={image[0]} className={'rounded-xl mb-2 w-[230px] h-[320px] object-fill'}/>
                <p className={'text-[#707070]'}>{author}</p>
                <h2 className={'font-bold'}>{title}</h2>
            </div>
        </Link>


    )
}