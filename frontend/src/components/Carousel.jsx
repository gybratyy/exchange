import {useEffect, useMemo, useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {CarouselItem} from "./CarouselItem.jsx";
import {useBookStore} from "../store/useBookStore.js";
import {useAuthStore} from "../store/useAuthStore.js";

export default function Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const {books, categories} = useBookStore();
    const {authUser} = useAuthStore();


    const userPreferences = authUser?.preferences || {};

    const recommendedBooks = useMemo(() => {
        if (!books || books.length === 0 || !categories || categories.length === 0) {
            return books || [];
        }

        const categoryNameToIdMap = categories.reduce((acc, category) => {
            acc[category.name] = category._id;
            return acc;
        }, {});

        const scoredBooks = books.map(book => {
            let preferenceScore = 0;
            if (book.categories && Array.isArray(book.categories)) {
                book.categories.forEach(categoryName => {
                    const categoryId = categoryNameToIdMap[categoryName];
                    if (categoryId && userPreferences[categoryId]) {
                        preferenceScore += userPreferences[categoryId];
                    }
                });
            }
            return {...book, preferenceScore};
        });

        return scoredBooks.sort((a, b) => {
            if (b.preferenceScore !== a.preferenceScore) {
                return b.preferenceScore - a.preferenceScore;
            }

            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    }, [books, categories, userPreferences]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 4 ? 0 : prevIndex + 1
        );
    };
    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? 4 : prevIndex - 1
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
                Книги не найдены
            </div>
        );
    }

    const carouselBooks = recommendedBooks.slice(0, 5);
    return (
        <div className="w-[80%] h-full flex flex-col items-center justify-center  relative overflow-hidden">

            <div className="bg-white  rounded-xl w-full  relative">

                <div className="relative h-full flex items-center justify-center overflow-hidden rounded-xl">
                    {carouselBooks.map((book, index) => (
                        <CarouselItem
                            key={book.id}
                            book={book}
                            isActive={index === currentIndex}
                        />
                    ))}
                </div>

                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-24 transform -translate-y-1/2 bg-[#C5C5C5] bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={28} color='#444444' />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2  right-24 transform -translate-y-1/2 bg-[#C5C5C5] bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    aria-label="Next slide"
                >
                    <ChevronRight size={28} color='#444444' />
                </button>


            </div>
            <div className="transform flex mx-auto mt-4 gap-2">
                {carouselBooks.map((_, index) => (
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
