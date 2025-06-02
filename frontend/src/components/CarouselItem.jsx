import {Link} from "react-router-dom";

export const CarouselItem = ({book, isActive, key}) => {
    if (!book) return null;

    return (
        <div key={key}
             className={`transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 absolute'
             } w-full `}
        >
            <div
                className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 md:p-12 rounded-[40px] w-full  bg-[#11131A] text-white px-20 py-16">
                <div className="flex-shrink-0 w-48 md:w-60 lg:w-72 shadow-xl rounded-xl overflow-hidden ">
                    <img
                        src={book.image}
                        alt={`Cover of ${book.title}`}
                        className="w-auto h-full object-cover aspect-[2/3]"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/300x450/E2E8F0/94A3B8?text=Image+Not+Found&font=lora`;
                        }}
                    />
                </div>
                <div className='flex flex-col justify-between items-start '>
                    <div className="text-center md:text-left flex-grow">
                        <h2 className="text-4xl mb-2 font-medium ">
                            {book.title}
                        </h2>
                        <p className="mb-4">{book.author}</p>

                        <p className=" mb-6 leading-7">
                            {book.description}
                        </p>

                    </div>

                    <Link to='/catalog' className='text-lg leading-6'>Открыть</Link>
                </div>

            </div>
        </div>
    );
};

