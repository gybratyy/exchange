import  { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {CarouselItem} from "./CarouselItem.jsx";
import {useBookStore} from "../store/useBookStore.js";

export default function     Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const {books} = useBookStore();
    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === books.length - 1 ? 0 : prevIndex + 1
        );
    };
    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? books.length - 1 : prevIndex - 1
        );
    };
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };
    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 7000);
        return () => clearInterval(slideInterval);
    }, [books.length]);

    if (!books || books.length === 0) {
        return (
            <div className="min-h-screen bg-slate-200 flex items-center justify-center text-slate-700">
                Loading books or no books available...
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center  relative overflow-hidden">

            <div className="bg-white  rounded-xl w-full  relative">

                <div className="relative h-full flex items-center justify-center overflow-hidden rounded-xl">
                    {books.map((book, index) => (
                        <CarouselItem
                            key={book.id}
                            book={book}
                            isActive={index === currentIndex}
                        />
                    ))}
                </div>

                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-[#C5C5C5] bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-all duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={28} color='#444444' />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-[#C5C5C5] bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-all duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    aria-label="Next slide"
                >
                    <ChevronRight size={28} color='#444444' />
                </button>


            </div>
            <div className="transform flex mx-auto mt-4 gap-2">
                {books.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentIndex === index ? 'bg-[#444444]' : 'bg-[#D9D9D9] hover:bg-slate-500'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
