import {Filter, RefreshCw} from "lucide-react";
import {Checkbox} from "./CheckBox.jsx";
import {RadioButton} from "./RadioButton.jsx";
import {Dropdown} from "./Dropdown.jsx";
import {PriceRange} from "./PriceRange.jsx";

export const SidebarFilter = ({filters, setFilters, dynamicFilterOptions, onCountryChange, availableCities, resetFilters}) => {
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

    const sellerRatingOptions = [
        { label: 'Любой рейтинг', value: 0 },
        { label: '5 звезд', value: 5 },
        { label: '4 звезды и выше', value: 4 },
        { label: '3 звезды и выше', value: 3 },
    ];


    return (
        <aside className="w-full md:w-72 lg:w-80 bg-white p-5  rounded-lg h-full overflow-y-auto">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <Filter size={20} className="mr-2 text-indigo-600" /> Фильтры
            </h2>
            {dynamicFilterOptions.productTypes.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-medium text-slate-700 mb-2 text-sm">Тип продукта</h3>
                    <div className="space-y-1.5">
                        {dynamicFilterOptions.productTypes.map((type) => (
                            <Checkbox
                                key={type}
                                label={type.charAt(0).toUpperCase() + type.slice(1)} // Capitalize
                                checked={filters.productTypes.includes(type)}
                                onChange={() => handleCheckboxChange('productTypes', type)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Categories */}
            {dynamicFilterOptions.categories.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-medium text-slate-700 mb-2 text-sm">Категории</h3>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto"> {/* Added scroll for many categories */}
                        {dynamicFilterOptions.categories.map((category) => (
                            <Checkbox
                                key={category}
                                label={category}
                                checked={filters.categories.includes(category)}
                                onChange={() => handleCheckboxChange('categories', category)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {dynamicFilterOptions.languages.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-medium text-slate-700 mb-2 text-sm">Язык</h3>
                    <div className="space-y-1.5">
                        {dynamicFilterOptions.languages.map((lang) => (
                            <Checkbox
                                key={lang.name}
                                label={lang.name}
                                flag={lang.flag} // Assuming you might add flags later based on language
                                checked={filters.languages.includes(lang.name)}
                                onChange={() => handleCheckboxChange('languages', lang.name)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {dynamicFilterOptions.types.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-medium text-slate-700 mb-2 text-sm">Тип объявления</h3>
                    <div className="space-y-1.5">
                        {dynamicFilterOptions.types.map((type) => (
                            <Checkbox
                                key={type.value}
                                label={type.label}
                                checked={filters.types.includes(type.value)}
                                onChange={() => handleCheckboxChange('types', type.value)}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-6">
                <h3 className="font-medium text-slate-700 mb-2 text-sm">Рейтинг (Книги)</h3>
                <div className="space-y-1.5">
                    {sellerRatingOptions.map((rating) => (
                        <RadioButton
                            key={rating.value}
                            label={rating.label}
                            name="bookRating" // Changed from sellerRating
                            value={rating.value}
                            checked={filters.bookRating === rating.value}
                            onChange={() => handleRadioChange('bookRating', rating.value)}
                        />
                    ))}
                </div>
            </div>


            {dynamicFilterOptions.countries.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-medium text-slate-700 mb-2 text-sm">Местоположение владельца</h3>
                    <div className="space-y-2">
                        <Dropdown
                            options={dynamicFilterOptions.countries}
                            selected={filters.country}
                            onChange={(value) => {
                                setFilters(prev => ({ ...prev, country: value, city: '' }));
                                onCountryChange(value);
                            }}
                            placeholder="Страна"
                        />
                        <Dropdown
                            options={availableCities}
                            selected={filters.city}
                            onChange={(value) => setFilters(prev => ({ ...prev, city: value }))}
                            placeholder="Город"
                            disabled={!filters.country || availableCities.length === 0}
                        />
                    </div>
                </div>
            )}

            {(filters.types.includes('forSale') || filters.types.length === 0 || dynamicFilterOptions.types.some(t => t.value === 'forSale')) && (
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
            )}


            {dynamicFilterOptions.conditions.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-medium text-slate-700 mb-2 text-sm">Состояние</h3>
                    <div className="space-y-1.5">
                        {dynamicFilterOptions.conditions.map((condition) => (
                            <Checkbox
                                key={condition}
                                label={condition.charAt(0).toUpperCase() + condition.slice(1)} // Capitalize
                                checked={filters.conditions.includes(condition)}
                                onChange={() => handleCheckboxChange('conditions', condition)}
                            />
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={resetFilters}
                className="w-full mt-4 py-2 px-4 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors flex items-center justify-center text-sm"
            >
                <RefreshCw size={16} className="mr-2" /> Сбросить все фильтры
            </button>
        </aside>
    );
};
