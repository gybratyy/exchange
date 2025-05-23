import React, { useState, useEffect } from 'react';
import { ChevronDown, Star, MapPin, Filter, Search, RefreshCw, Tag, Book, FileText, Smile, Globe } from 'lucide-react';

// --- Sample Data ---
const sampleProducts = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    title: 'Жастарға',
    author: 'Шакарім Құдайбердіұлы',
    type: i % 3 === 0 ? 'Обмен' : 'Покупка', // 'Exchange' or 'Purchase'
    price: i % 3 !== 0 ? `${1999 + i * 100} тг` : null,
    imageUrl: `https://placehold.co/300x450/E2E8F0/4A5568?text=Книга+${i + 1}&font=lora`,
    sellerRating: Math.floor(Math.random() * 3) + 3, // 3 to 5 stars
    language: ['Казахский', 'Русский', 'Английский'][i % 3],
    condition: ['Новое', 'Отличное', 'Хорошее', 'Б/У'][i % 4],
    productType: ['Книги', 'Журналы', 'Комиксы', 'Манга'][i % 4],
    location: {
        city: ['Алматы', 'Астана', 'Шымкент'][i % 3],
        country: 'Казахстан',
    },
}));

const filterOptions = {
    productTypes: ['Книги', 'Журналы', 'Комиксы', 'Манга'],
    languages: [
        { name: 'Казахский', flag: '🇰🇿' },
        { name: 'Русский', flag: '🇷🇺' },
        { name: 'Английский', flag: '🇬🇧' },
    ],
    types: ['Обмен', 'Покупка'],
    sellerRatings: [
        { label: 'Любой рейтинг', value: 0 },
        { label: '5 звезд', value: 5 },
        { label: '4 звезды и выше', value: 4 },
        { label: '3 звезды и выше', value: 3 },
    ],
    conditions: ['Новое', 'Отличное', 'Хорошее', 'Б/У'],
    countries: ['Казахстан', 'Россия', 'США', 'Великобритания'], // Example countries
    cities: { // Example cities per country
        'Казахстан': ['Алматы', 'Астана', 'Шымкент', 'Караганда'],
        'Россия': ['Москва', 'Санкт-Петербург', 'Новосибирск'],
        'США': ['New York', 'Los Angeles', 'Chicago'],
        'Великобритания': ['London', 'Manchester', 'Birmingham']
    }
};

// --- Helper Components ---

// Checkbox component
const Checkbox = ({ label, checked, onChange, flag }) => (
    <label className="flex items-center space-x-2 text-sm text-slate-700 hover:text-slate-900 cursor-pointer">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="form-checkbox h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
        />
        <span>{label}</span>
        {flag && <span className="text-xs">{flag}</span>}
    </label>
);

// Radio button component (can be styled similarly or use native ones)
const RadioButton = ({ label, name, value, checked, onChange }) => (
    <label className="flex items-center space-x-2 text-sm text-slate-700 hover:text-slate-900 cursor-pointer">
        <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            className="form-radio h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
        />
        <span>{label}</span>
    </label>
);


// Dropdown component
const Dropdown = ({ options, selected, onChange, placeholder }) => (
    <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
    >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
            <option key={opt} value={opt}>
                {opt}
            </option>
        ))}
    </select>
);

const PriceRange = ({ min, max, onMinChange, onMaxChange, currentMin, currentMax }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <input
                type="number"
                placeholder="От"
                value={currentMin}
                onChange={(e) => onMinChange(Number(e.target.value))}
                className="w-1/2 p-2 border border-slate-300 rounded-md shadow-sm text-sm mr-1"
            />
            <input
                type="number"
                placeholder="До"
                value={currentMax}
                onChange={(e) => onMaxChange(Number(e.target.value))}
                className="w-1/2 p-2 border border-slate-300 rounded-md shadow-sm text-sm ml-1"
            />
        </div>
        {/* Basic range input, for a dual thumb slider, a library or custom component is needed */}
        <input
            type="range"
            min={min}
            max={max}
            value={currentMax} // Simplified: only shows upper bound
            onChange={(e) => onMaxChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>{min} тг</span>
            <span>{max} тг</span>
        </div>
    </div>
);

// --- Main Components ---

// Sidebar for filters
const Sidebar = ({ filters, setFilters, availableCities, onCountryChange }) => {
    const handleCheckboxChange = (filterKey, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterKey]: prev[filterKey].includes(value)
                ? prev[filterKey].filter((item) => item !== value)
                : [...prev[filterKey], value],
        }));
    };

    const handleRadioChange = (filterKey, value) => {
        setFilters(prev => ({ ...prev, [filterKey]: value }));
    };

    return (
        <aside className="w-full md:w-72 lg:w-80 bg-white p-5 shadow-lg rounded-lg h-full overflow-y-auto">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <Filter size={20} className="mr-2 text-indigo-600" /> Фильтры
            </h2>

            {/* Product Type */}
            <div className="mb-6">
                <h3 className="font-medium text-slate-700 mb-2 text-sm">Тип продукта</h3>
                <div className="space-y-1.5">
                    {filterOptions.productTypes.map((type) => (
                        <Checkbox
                            key={type}
                            label={type}
                            checked={filters.productTypes.includes(type)}
                            onChange={() => handleCheckboxChange('productTypes', type)}
                        />
                    ))}
                </div>
            </div>

            {/* Language */}
            <div className="mb-6">
                <h3 className="font-medium text-slate-700 mb-2 text-sm">Язык</h3>
                <div className="space-y-1.5">
                    {filterOptions.languages.map((lang) => (
                        <Checkbox
                            key={lang.name}
                            label={lang.name}
                            flag={lang.flag}
                            checked={filters.languages.includes(lang.name)}
                            onChange={() => handleCheckboxChange('languages', lang.name)}
                        />
                    ))}
                </div>
            </div>

            {/* Type (Exchange/Purchase) */}
            <div className="mb-6">
                <h3 className="font-medium text-slate-700 mb-2 text-sm">Тип</h3>
                <div className="space-y-1.5">
                    {filterOptions.types.map((type) => (
                        <Checkbox
                            key={type}
                            label={type}
                            checked={filters.types.includes(type)}
                            onChange={() => handleCheckboxChange('types', type)}
                        />
                    ))}
                </div>
            </div>

            {/* Seller Rating */}
            <div className="mb-6">
                <h3 className="font-medium text-slate-700 mb-2 text-sm">Рейтинг продавца</h3>
                <div className="space-y-1.5">
                    {filterOptions.sellerRatings.map((rating) => (
                        <RadioButton
                            key={rating.value}
                            label={rating.label}
                            name="sellerRating"
                            value={rating.value}
                            checked={filters.sellerRating === rating.value}
                            onChange={() => handleRadioChange('sellerRating', rating.value)}
                        />
                    ))}
                </div>
            </div>

            {/* Location */}
            <div className="mb-6">
                <h3 className="font-medium text-slate-700 mb-2 text-sm">Местоположение продавца</h3>
                <div className="space-y-2">
                    <Dropdown
                        options={filterOptions.countries}
                        selected={filters.country}
                        onChange={(value) => {
                            setFilters(prev => ({ ...prev, country: value, city: '' }));
                            onCountryChange(value); // To update available cities
                        }}
                        placeholder="Страна"
                    />
                    <Dropdown
                        options={availableCities}
                        selected={filters.city}
                        onChange={(value) => setFilters(prev => ({ ...prev, city: value }))}
                        placeholder="Город"
                    />
                </div>
            </div>

            {/* Price */}
            <div className="mb-6">
                <h3 className="font-medium text-slate-700 mb-2 text-sm">Цена</h3>
                <PriceRange
                    min={0}
                    max={100000}
                    currentMin={filters.priceRange.min}
                    currentMax={filters.priceRange.max}
                    onMinChange={(val) => setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, min: val } }))}
                    onMaxChange={(val) => setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, max: val } }))}
                />
            </div>

            {/* Condition */}
            <div className="mb-6">
                <h3 className="font-medium text-slate-700 mb-2 text-sm">Состояние</h3>
                <div className="space-y-1.5">
                    {filterOptions.conditions.map((condition) => (
                        <Checkbox
                            key={condition}
                            label={condition}
                            checked={filters.conditions.includes(condition)}
                            onChange={() => handleCheckboxChange('conditions', condition)}
                        />
                    ))}
                </div>
            </div>
            <button
                onClick={() => setFilters({ /* Reset filters to initial state */
                    productTypes: [],
                    languages: [],
                    types: [],
                    sellerRating: 0,
                    country: '',
                    city: '',
                    priceRange: { min: 0, max: 100000 },
                    conditions: [],
                })}
                className="w-full mt-4 py-2 px-4 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors flex items-center justify-center text-sm"
            >
                <RefreshCw size={16} className="mr-2" /> Сбросить все фильтры
            </button>
        </aside>
    );
};

// Product Card component
const ProductCard = ({ product }) => {
    const getProductIcon = (type) => {
        switch (type) {
            case 'Книги': return <Book size={14} className="mr-1 text-slate-500" />;
            case 'Журналы': return <FileText size={14} className="mr-1 text-slate-500" />;
            case 'Комиксы':
            case 'Манга': return <Smile size={14} className="mr-1 text-slate-500" />;
            default: return <Tag size={14} className="mr-1 text-slate-500" />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col">
            <div className="relative">
                <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-64 object-cover aspect-[3/4]"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x450/CBD5E1/94A3B8?text=Error&font=lora'; }}
                />
                <div
                    className={`absolute top-2 right-2 px-2.5 py-1 text-xs font-semibold text-white rounded-full shadow-md ${
                        product.type === 'Обмен' ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                >
                    {product.type === 'Обмен' ? 'Обмен' : product.price || 'Покупка'}
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded flex items-center">
                    {getProductIcon(product.productType)} {product.productType}
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-slate-800 mb-1 truncate" title={product.title}>
                    {product.title}
                </h3>
                <p className="text-sm text-slate-600 mb-2 truncate" title={product.author}>{product.author}</p>
                <div className="flex items-center text-xs text-slate-500 mb-1">
                    <Globe size={14} className="mr-1" /> {product.language}
                </div>
                <div className="flex items-center text-xs text-slate-500 mb-3">
                    <MapPin size={14} className="mr-1" /> {product.location.city}, {product.location.country}
                </div>

                <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                className={i < product.sellerRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                            />
                        ))}
                        <span className="text-xs text-slate-500 ml-1">({product.sellerRating})</span>
                    </div>
                    <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 px-3 rounded-md transition-colors">
                        Детали
                    </button>
                </div>
            </div>
        </div>
    );
};



const ProductGrid = ({ products }) => {
    if (products.length === 0) {
        return <div className="text-center text-slate-500 py-10 col-span-full">Нет товаров, соответствующих вашим фильтрам.</div>;
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

// Main App component
export default function Catalog() {
    const [filters, setFilters] = useState({
        productTypes: [],
        languages: [],
        types: [],
        sellerRating: 0,
        country: '',
        city: '',
        priceRange: { min: 0, max: 100000 },
        conditions: [],
        searchTerm: '',
    });

    const [availableCities, setAvailableCities] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    useEffect(() => {
        // Simulate fetching cities based on country (if needed for dynamic dropdowns)
        if (filters.country && filterOptions.cities[filters.country]) {
            setAvailableCities(filterOptions.cities[filters.country]);
        } else {
            setAvailableCities([]);
        }
    }, [filters.country]);

    const handleCountryChange = (countryName) => {
        if (countryName && filterOptions.cities[countryName]) {
            setAvailableCities(filterOptions.cities[countryName]);
        } else {
            setAvailableCities([]);
        }
    };


    const filteredProducts = sampleProducts.filter((product) => {
        const { productTypes, languages, types, sellerRating, country, city, priceRange, conditions, searchTerm } = filters;

        if (productTypes.length > 0 && !productTypes.includes(product.productType)) return false;
        if (languages.length > 0 && !languages.includes(product.language)) return false;
        if (types.length > 0 && !types.includes(product.type)) return false;
        if (sellerRating > 0 && product.sellerRating < sellerRating) return false;
        if (country && product.location.country !== country) return false;
        if (city && product.location.city !== city) return false;

        const productPrice = product.price ? parseInt(product.price.replace(' тг', '')) : (product.type === 'Обмен' ? 0 : Infinity);
        if (product.type === 'Покупка' && (productPrice < priceRange.min || productPrice > priceRange.max)) return false;
        // If type is 'Обмен', price filter might not apply or apply differently. For now, it passes if type is 'Обмен'.
        if (product.type === 'Обмен' && (priceRange.min > 0 || priceRange.max < 100000 /* some default max */)) {
            // If 'Обмен' items should be excluded by price filter, add logic here.
            // For now, they pass if price filter is not at its widest.
        }


        if (conditions.length > 0 && !conditions.includes(product.condition)) return false;
        if (searchTerm &&
            !(product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.author.toLowerCase().includes(searchTerm.toLowerCase()))) {
            return false;
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-6">
            <div className="container mx-auto">
                {/* Header / Search Bar */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold text-slate-800">Каталог Товаров</h1>
                    <div className="relative w-full sm:w-1/2 md:w-1/3">
                        <input
                            type="text"
                            placeholder="Поиск по названию или автору..."
                            value={filters.searchTerm}
                            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                            className="w-full py-2.5 pl-10 pr-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    {/* Sidebar for Desktop */}
                    <div className="hidden md:block md:w-72 lg:w-80 flex-shrink-0">
                        <Sidebar filters={filters} setFilters={setFilters} availableCities={availableCities} onCountryChange={handleCountryChange}/>
                    </div>

                    {/* Mobile Sidebar (Drawer) */}
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
                                    <Sidebar filters={filters} setFilters={setFilters} availableCities={availableCities} onCountryChange={handleCountryChange}/>
                                </div>
                            </div>
                            <div className="flex-shrink-0 w-14" aria-hidden="true">
                                {/* Dummy element to force sidebar to shrink to fit close icon */}
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    <main className="flex-grow">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-slate-600">Найдено товаров: {filteredProducts.length}</p>
                            {/* Sorting options can be added here */}
                        </div>
                        <ProductGrid products={filteredProducts} />
                    </main>
                </div>
            </div>
            <p className="text-center text-xs text-slate-500 mt-10">
                Product Catalog by Gemini. Placeholders by placehold.co. Icons by Lucide React.
            </p>
        </div>
    );
}