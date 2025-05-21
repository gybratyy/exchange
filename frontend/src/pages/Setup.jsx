import  { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown, PlusCircle, MinusCircle, CheckCircle } from 'lucide-react';

const initialGenres = [
    'Творчество', 'Ужасы', 'История', 'Романтика',
    'Наука', 'Мистика', 'Криминал', 'Культура', 'Манга'
];

const locationsData = {
    Казахстан: ['Астана', 'Алматы', 'Шымкент', 'Караганда'],
    Россия: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург'],
    США: ['New York', 'Los Angeles', 'Chicago', 'Houston'],
    Германия: ['Берлин', 'Мюнхен', 'Гамбург', 'Франкфурт']
};
const countries = Object.keys(locationsData);

// Stepper Component
const Stepper = ({ currentStep }) => {
    const steps = [
        { number: 1, title: 'Select your favourite genre' },
        { number: 2, title: 'Select your location' }
    ];

    return (
        <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-8 md:mb-12">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                    <div
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm md:text-base font-semibold transition-all duration-300
              ${currentStep === step.number ? 'bg-indigo-600 text-white scale-110' :
                            currentStep > step.number ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'}`}
                    >
                        {currentStep > step.number ? <CheckCircle size={16} /> : step.number}
                    </div>
                    <span className={`ml-2 text-xs md:text-sm font-medium transition-colors duration-300
            ${currentStep === step.number ? 'text-indigo-600' :
                        currentStep > step.number ? 'text-green-600' : 'text-slate-500'}`}
                    >
            {step.title}
          </span>
                    {index < steps.length - 1 && (
                        <div className={`hidden sm:block w-8 h-0.5 ml-4 md:ml-6 transition-colors duration-300 ${currentStep > step.number ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Genre Selection Step
const GenreStep = ({ selectedGenres, setSelectedGenres, onNext }) => {
    const minGenres = 3;
    const genresSelectedCount = selectedGenres.length;

    const toggleGenre = (genre) => {
        setSelectedGenres(prev =>
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        );
    };

    const canProceed = genresSelectedCount >= minGenres;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-3">
                Выберите ваш любимый жанр
            </h2>
            <p className="text-sm md:text-base text-slate-600 text-center mb-6">
                Выберите как минимум {minGenres} ваших любимых жанров. Мы используем ваш любимый жанр чтобы сделать лучше подборку рекомендаций, что поможет вам видеть их у себя в ленте.
            </p>

            {/* Progress Bar */}
            <div className="flex space-x-1 mb-8 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                {Array.from({ length: minGenres }).map((_, i) => (
                    <div
                        key={i}
                        className={`flex-1 h-full rounded-full transition-all duration-300 ease-out
              ${i < genresSelectedCount ? 'bg-green-500' : 'bg-transparent'}`}
                    ></div>
                ))}
                {/* This fills the rest of the bar if more than minGenres are selected, or stays empty */}
                <div className={`flex-grow h-full transition-all duration-300 ease-out ${genresSelectedCount >= minGenres ? 'bg-green-500' : 'bg-transparent'}`}></div>
            </div>


            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
                {initialGenres.map(genre => {
                    const isSelected = selectedGenres.includes(genre);
                    return (
                        <button
                            key={genre}
                            onClick={() => toggleGenre(genre)}
                            className={`p-3 md:p-4 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ease-in-out
                flex items-center justify-between text-left
                ${isSelected
                                ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700 shadow-md ring-2 ring-indigo-300 ring-offset-1'
                                : 'bg-slate-50 hover:bg-slate-200 border border-slate-300 text-slate-700'
                            }`}
                        >
                            <span>{genre}</span>
                            {isSelected ? <MinusCircle size={18} className="text-indigo-500 ml-2 flex-shrink-0" /> : <PlusCircle size={18} className="text-slate-400 ml-2 flex-shrink-0" />}
                        </button>
                    );
                })}
            </div>

            <p className="text-center text-sm text-slate-600 mb-8">
                Тут нет ваших любимых жанров? <a href="#" className="text-indigo-600 hover:underline font-medium">Напишите</a>
            </p>

            <button
                onClick={onNext}
                disabled={!canProceed}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300
          ${canProceed ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105' : 'bg-slate-400 cursor-not-allowed'}`}
            >
                Продолжить
            </button>
        </div>
    );
};

// Location Selection Step
const LocationStep = ({ selectedCountry, setSelectedCountry, selectedCity, setSelectedCity, onNext, onBack }) => {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (selectedCountry) {
            setCities(locationsData[selectedCountry] || []);
        } else {
            setCities([]);
        }
        // Reset city if country changes and selected city is not in the new list of cities
        if (selectedCountry && selectedCity && !locationsData[selectedCountry]?.includes(selectedCity)) {
            setSelectedCity('');
        }
    }, [selectedCountry, selectedCity, setSelectedCity]);

    const canProceed = selectedCountry && selectedCity;

    return (
        <div className="w-full max-w-md mx-auto">
            <button onClick={onBack} className="flex items-center text-sm text-slate-600 hover:text-indigo-600 mb-6 group">
                <ChevronLeft size={18} className="mr-1 transition-transform duration-200 group-hover:-translate-x-1" />
                Назад
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-3">
                Выберите вашу страну и город
            </h2>
            <p className="text-sm md:text-base text-slate-600 text-center mb-8">
                Укажите страну и город, чтобы мы могли подобрать лучшие рекомендации для вас.
            </p>

            <div className="space-y-6 mb-8">
                <div className="relative">
                    <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1">Страна</label>
                    <select
                        id="country"
                        value={selectedCountry}
                        onChange={e => {
                            setSelectedCountry(e.target.value);
                            setSelectedCity(''); // Reset city when country changes
                        }}
                        className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-8"
                    >
                        <option value="">Выберите страну</option>
                        {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-3 top-1/2 mt-2.5 pointer-events-none text-slate-400" />
                </div>

                <div className="relative">
                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">Город</label>
                    <select
                        id="city"
                        value={selectedCity}
                        onChange={e => setSelectedCity(e.target.value)}
                        disabled={!selectedCountry || cities.length === 0}
                        className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-8 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    >
                        <option value="">Выберите город</option>
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-3 top-1/2 mt-2.5 pointer-events-none text-slate-400" />
                </div>
            </div>

            <p className="text-center text-sm text-slate-600 mb-8">
                Если вы не нашли нужный город – <a href="#" className="text-indigo-600 hover:underline font-medium">напишите нам</a>, и мы постараемся добавить его как можно скорее.
            </p>

            <button
                onClick={onNext}
                disabled={!canProceed}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300
          ${canProceed ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105' : 'bg-slate-400 cursor-not-allowed'}`}
            >
                Продолжить
            </button>
        </div>
    );
};


export default function Setup() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const handleNextStep = () => {
        if (currentStep === 1 && selectedGenres.length >= 3) {
            setCurrentStep(2);
        } else if (currentStep === 2 && selectedCountry && selectedCity) {
            // Handle final submission or navigation to next part of app
            alert(`Setup Complete!\nGenres: ${selectedGenres.join(', ')}\nLocation: ${selectedCity}, ${selectedCountry}`);
            // Potentially reset or navigate away
            // setCurrentStep(1);
            // setSelectedGenres([]);
            // setSelectedCountry('');
            // setSelectedCity('');
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-6 md:p-10">
                {currentStep === 1 && (
                    <button onClick={() => alert("Navigate back from app")} className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center text-sm text-slate-600 hover:text-indigo-600 group">
                        <ChevronLeft size={18} className="mr-1 transition-transform duration-200 group-hover:-translate-x-1" />
                        Назад
                    </button>
                )}
                <Stepper currentStep={currentStep} />
                {currentStep === 1 && (
                    <GenreStep
                        selectedGenres={selectedGenres}
                        setSelectedGenres={setSelectedGenres}
                        onNext={handleNextStep}
                    />
                )}
                {currentStep === 2 && (
                    <LocationStep
                        selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                    />
                )}
            </div>
            <p className="text-center text-xs text-slate-500 mt-8">
                Two-Step Setup by Gemini. Icons by Lucide React.
            </p>
        </div>
    );
}