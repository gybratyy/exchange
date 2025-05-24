export const CarouselItem = ({ book, isActive, key }) => {
    if (!book) return null;

    return (
        <div key={key}
            className={`transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 absolute'
            } w-full `}
        >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 md:p-12 rounded-[40px] w-full  bg-[#202020] text-white">
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

                <div className="text-center md:text-left flex-grow">
                    <h2 className="text-3xl md:text-4xl font-bold  mb-2 font-serif">
                        {book.title}
                    </h2>
                    <p className="text-lg  mb-4">{book.author}</p>

                    <p className=" leading-relaxed mb-6 text-sm md:text-base">
                        {book.description}
                    </p>

                </div>
            </div>
        </div>
    );
};
