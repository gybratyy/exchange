import {Star} from "lucide-react";

export const CarouselItem = ({ book, isActive, key }) => {
    if (!book) return null;

    return (
        <div key={key}
            className={`transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 absolute'
            } w-full `}
        >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 md:p-12 rounded-[40px] w-full  bg-[#202020] text-white">
                {/* Book Cover */}
                <div className="flex-shrink-0 w-48 md:w-60 lg:w-72 shadow-xl rounded-xl overflow-hidden">
                    <img
                        src={book.image}
                        alt={`Cover of ${book.title}`}
                        className="w-full h-auto object-cover aspect-[2/3]"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/300x450/E2E8F0/94A3B8?text=Image+Not+Found&font=lora`;
                        }}
                    />
                </div>

                {/* Book Details */}
                <div className="text-center md:text-left flex-grow">
                    <h2 className="text-3xl md:text-4xl font-bold  mb-2 font-serif">
                        {book.title}
                    </h2>
                    <p className="text-lg  mb-4">{book.author}</p>
                    {/*<div className="flex justify-center md:justify-start items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-5 h-5 ${i < book.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-400'
                                }`}
                            />
                        ))}
                    </div>*/}
                    <p className=" leading-relaxed mb-6 text-sm md:text-base">
                        {book.description}
                    </p>
                   {/* <button className="bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-slate-600 transition-colors duration-300">
                        Открыть
                    </button>*/}
                </div>
            </div>
        </div>
    );
};
