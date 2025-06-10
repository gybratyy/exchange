import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {axiosInstance} from '../lib/axios';
import {Loader} from 'lucide-react';

import {HomePageSectionContainer} from "../components/HomePageSectionContainer.jsx";
import {BookCard} from "../components/BookCard.jsx";

const CategoryPage = () => {
    const {id: categoryId} = useParams();
    const [pageData, setPageData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!categoryId) return;
            setIsLoading(true);
            setError(null);
            try {
                const res = await axiosInstance.get(`/books/category/${categoryId}`);
                setPageData(res.data);
            } catch (err) {
                setError("Failed to load category data. Please try again.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [categoryId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin h-12 w-12"/>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 py-20">{error}</div>;
    }

    if (!pageData) {
        return <div className="text-center py-20">No data found for this category.</div>;
    }

    const {selectedCategory, otherCategories, sections} = pageData;

    return (
        <div className=" mx-auto py-8 pt-24">
            <div className='w-[80%] mx-auto'><h1 className="text-4xl font-bold mb-4">{selectedCategory.name}</h1></div>


            <div className="w-[80%] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12">
                {otherCategories.map(cat => (
                    <Link
                        key={cat._id}
                        to={`/catalog/categories/${cat._id}`}
                        className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex flex-col justify-between text-center"
                    >
                        <span className="font-semibold text-gray-800">{cat.name}</span>
                        <span className="text-xs text-gray-500 mt-1">{cat.bookCount} books</span>
                    </Link>
                ))}
            </div>

            <div className="w-full">
                {sections.map((section, index) => (
                    <HomePageSectionContainer
                        key={section.category._id}
                        name={section.category.name}
                        link={`/catalog/categories/${section.category._id}`}
                    >
                        <div className="w-[80%] h-[100%]  grid grid-cols-12 gap-6 pt-10 ">
                            {section.books.map(book => (
                                <BookCard key={book._id} book={book}/>
                            ))}
                        </div>
                    </HomePageSectionContainer>
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;
