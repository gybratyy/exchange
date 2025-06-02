import {useEffect, useMemo, useState} from 'react';
import {Filter, Loader, Search} from 'lucide-react';
import {useBookStore} from "../store/useBookStore.js";
import {SidebarFilter} from "../components/SidebarFilter.jsx";
import {ProductGrid} from "../components/ProductGrid.jsx";

const initialFiltersState = {
    productTypes: [],
    categories: [],
    languages: [],
    types: [],
    bookRating: 0,
    country: '',
    city: '',
    priceRange: { min: 0, max: 100000 },
    conditions: [],
    searchTerm: '',
};

export default function Catalog() {
    const { books, getBooks, isBooksLoading } = useBookStore();
    const [filters, setFilters] = useState(initialFiltersState);
    const [dynamicFilterOptions, setDynamicFilterOptions] = useState({
        productTypes: [],
        categories: [],
        languages: [],
        types: [
            { value: 'forSale', label: 'Продажа' },
            { value: 'forExchange', label: 'Обмен' },
            { value: 'forFree', label: 'Бесплатно' },
            { value: 'any', label: 'Любой (Продажа/Обмен)'}
        ],
        conditions: [],
        countries: [],
        citiesByCountry: {},
        minPrice: 0,
        maxPrice: 100000,
    });
    const [availableCities, setAvailableCities] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        getBooks();
    }, [getBooks]);

    useEffect(() => {
        if (books && books.length > 0) {
            const productTypes = [...new Set(books.map(book => book.productType).filter(Boolean))];
            const categories = [
                ...new Set(
                    books
                        .flatMap(book => Array.isArray(book.categories) ? book.categories.map(cat => cat.name) : [])
                        .filter(Boolean)
                )
            ].sort();
            const languages = [...new Set(books.map(book => book.language).filter(Boolean))].map(lang => ({name: lang, flag: ''})).sort((a,b) => a.name.localeCompare(b.name));


            const uniqueTypesInBooks = [...new Set(books.map(book => book.type).filter(Boolean))];
            const typeOptionsWithLabels = dynamicFilterOptions.types.filter(opt => uniqueTypesInBooks.includes(opt.value));


            const conditions = [...new Set(books.map(book => book.condition).filter(Boolean))];

            const countries = [...new Set(books.map(book => book.owner?.country).filter(Boolean))].sort();
            const citiesByCountry = books.reduce((acc, book) => {
                if (book.owner?.country && book.owner?.city) {
                    if (!acc[book.owner.country]) {
                        acc[book.owner.country] = new Set();
                    }
                    acc[book.owner.country].add(book.owner.city);
                }
                return acc;
            }, {});
            Object.keys(citiesByCountry).forEach(country => {
                citiesByCountry[country] = [...citiesByCountry[country]].sort();
            });

            const prices = books.filter(book => book.type === 'forSale' && typeof book.price === 'number').map(book => book.price);
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
            const maxPrice = prices.length > 0 ? Math.max(...prices) : 100000;


            setDynamicFilterOptions(prev => ({
                ...prev,
                productTypes,
                categories,
                languages,
                types: typeOptionsWithLabels.length > 0 ? typeOptionsWithLabels : prev.types,
                conditions,
                countries,
                citiesByCountry,
                minPrice,
                maxPrice,
            }));


            setFilters(currentFilters => ({
                ...currentFilters,
                priceRange: {
                    min: minPrice,
                    max: maxPrice
                }
            }));
        }
    }, [books]);

    useEffect(() => {
        if (filters.country && dynamicFilterOptions.citiesByCountry[filters.country]) {
            setAvailableCities(dynamicFilterOptions.citiesByCountry[filters.country]);
        } else {
            setAvailableCities([]);
        }
    }, [filters.country, dynamicFilterOptions.citiesByCountry]);

    const handleCountryChange = (countryName) => {
        if (countryName && dynamicFilterOptions.citiesByCountry[countryName]) {
            setAvailableCities(dynamicFilterOptions.citiesByCountry[countryName]);
        } else {
            setAvailableCities([]);
        }
        setFilters(prev => ({ ...prev, city: ''}));
    };

    const resetFiltersHandler = () => {
        setFilters({
            ...initialFiltersState,
            priceRange: {
                min: dynamicFilterOptions.minPrice,
                max: dynamicFilterOptions.maxPrice,
            }
        });
        setAvailableCities([]);
    };


    const filteredProducts = useMemo(() => {
        if (isBooksLoading || !books) return [];
        return books.filter((product) => {
            const { productTypes, categories, languages, types, bookRating, country, city, priceRange, conditions, searchTerm } = filters;

            if (productTypes.length > 0 && !productTypes.includes(product.productType)) return false;
            if (categories.length > 0 && !product.categories.some(cat => categories.includes(typeof cat === 'string' ? cat : cat.name))) return false;
            if (languages.length > 0 && !languages.includes(product.language)) return false;
            if (types.length > 0 && !types.includes(product.type)) return false;


            if (bookRating > 0) {
                let averageProductRating = 0;
                if (product.reviews && product.reviews.length > 0) {
                    const totalRating = product.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
                    averageProductRating = totalRating / product.reviews.length;
                }
                if (averageProductRating < bookRating) return false;
            }


            if (country && product.owner?.country !== country) return false;
            if (city && product.owner?.city !== city) return false;

            if (product.type === 'forSale') {
                const productPrice = product.price;
                if (typeof productPrice === 'number') {
                    if (priceRange.min > 0 && productPrice < priceRange.min) return false;
                    if (priceRange.max < dynamicFilterOptions.maxPrice && productPrice > priceRange.max) return false;
                }
            } else if (types.includes('forSale') && (priceRange.min > 0 || priceRange.max < dynamicFilterOptions.maxPrice) ) {
                return false;
            }


            if (conditions.length > 0 && !conditions.includes(product.condition)) return false;

            if (searchTerm &&
                !(product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (product.author && product.author.toLowerCase().includes(searchTerm.toLowerCase())))) {
                return false;
            }
            return true;
        });
    }, [books, filters, isBooksLoading, dynamicFilterOptions.maxPrice]);

    if (isBooksLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin"/>
                <p className="ml-2 text-slate-600">Загрузка книг...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-6 pt-20"> {/* Added pt-20 for navbar */}
            <div className="container mx-auto">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold text-slate-800">Каталог Товаров</h1>
                    <div className="relative w-full sm:w-1/2 md:w-1/3">
                        <input
                            type="text"
                            placeholder="Поиск по названию или автору..."
                            value={filters.searchTerm}
                            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                            className="w-full py-2.5 pl-10 pr-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        aria-label="Toggle Filters"
                    >
                        <Filter size={20} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="hidden md:block md:w-72 lg:w-80 flex-shrink-0">
                        <SidebarFilter
                            filters={filters}
                            setFilters={setFilters}
                            dynamicFilterOptions={dynamicFilterOptions}
                            onCountryChange={handleCountryChange}
                            availableCities={availableCities}
                            resetFilters={resetFiltersHandler}
                        />
                    </div>

                    {isSidebarOpen && (
                        <div className="fixed inset-0 z-40 flex md:hidden">
                            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
                            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                                <div className="absolute top-0 right-0 -mr-12 pt-2">
                                    <button
                                        type="button"
                                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <span className="sr-only">Close sidebar</span>
                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                    <SidebarFilter
                                        filters={filters}
                                        setFilters={setFilters}
                                        dynamicFilterOptions={dynamicFilterOptions}
                                        onCountryChange={handleCountryChange}
                                        availableCities={availableCities}
                                        resetFilters={resetFiltersHandler}
                                    />
                                </div>
                            </div>
                            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
                        </div>
                    )}

                    <main className="flex-grow">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-slate-600">Найдено товаров: {filteredProducts.length}</p>
                        </div>
                        <ProductGrid products={filteredProducts} />
                    </main>
                </div>
            </div>
            <p className="text-center text-xs text-slate-500 mt-10 pb-6">
                Каталог товаров.
            </p>
        </div>
    );
}