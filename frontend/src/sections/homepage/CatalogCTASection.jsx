import {useBookStore} from "../../store/useBookStore.js";
import {useNavigate} from "react-router-dom";

export const CatalogCTASection = () => {

const navigate = useNavigate()

    const { categories} = useBookStore()
    const backgroundImage = '/catalogctaimage.png'
    const backgroundColor = 'bg-slate-100'
    const illustrationUrl = '/catalogctaillustration.png'
    const sectionStyle = backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {};

    return (
        <section
            className={`w-full py-12 md:py-20 ${
                backgroundImage ? 'bg-cover bg-center' : backgroundColor
            }`}
            style={sectionStyle}
        >
            <div className="container mx-auto max-w-[50%] rounded-2xl p-6 sm:p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 md:mb-12">
                    <div className="flex-shrink-0 w-full md:w-1/3 max-w-xs mx-auto md:mx-0">
                        <img
                            src={illustrationUrl}
                            alt="Девушка читает книгу"
                            className="w-full h-auto object-contain rounded-lg" // Removed shadow-md
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/250x350/E2E8F0/94A3B8?text=Error&font=lora';
                            }}
                        />
                    </div>

                    <div className="flex-grow flex flex-col justify-around text-center md:text-left mt-6 md:mt-0 text-white">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold  mb-4 md:mb-6 leading-tight">
                            Открой мир книг - найди свою историю
                        </h1>
                        <p className=" text-base sm:text-lg leading-relaxed">
                            Тысячи книг ждут нового читателя.
                            <br className="hidden sm:block" />
                            История, фантастика, психология и многое другое - выбери, что
                            вдохновит именно тебя.
                        </p>
                    </div>
                </div>


                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12">

                      {categories?.slice(0,4).map((category) => (
                            <div
                                key={category.name}
                                className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105"
                            >
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://placehold.co/200x200/334155/E2E8F0?text=${encodeURIComponent(category.name)}&font=lora`;
                                    }}
                                />

                                <p className="absolute top-4 left-4   rounded text-white text-xs sm:text-sm md:text-base font-semibold">
                                    {category.name}
                                </p>
                            </div>
                        ))}

                </div>

                <div className="text-center">
                    <button onClick={() => navigate('/catalog')}  className='btn btn-outline bg-white btn-wide rounded-3xl btn-xl ' >
                        View All
                    </button>
                </div>
            </div>
        </section>
    );
};


