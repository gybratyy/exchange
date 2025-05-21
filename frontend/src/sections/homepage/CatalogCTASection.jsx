import { BookOpen, Film, History, Heart, Search } from 'lucide-react';
import {useBookStore} from "../../store/useBookStore.js";
import {useEffect} from "react";
import {HomePageSectionContainer} from "../../components/HomePageSectionContainer.jsx";
export const CatalogCTASection = () => {
    const {categories,getCategories} = useBookStore()


console.log(categories)

    return(
      <HomePageSectionContainer>
          <div className="w-full max-w-5xl bg-white shadow-xl rounded-lg p-6 md:p-10 mx-auto">

              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 md:mb-12">

                  <div className="flex-shrink-0 w-full md:w-1/3 flex flex-col items-center text-center md:text-left">
                      <div className="relative w-56 h-80 md:w-64 md:h-96 bg-slate-200 rounded-lg shadow-lg flex flex-col items-center justify-center p-4">
                          <img
                              src="https://placehold.co/200x280/BFDBFE/1E3A8A?text=Иллюстрация+книги&font=lora"
                              alt="Иллюстрация"
                              className="w-full h-full object-contain rounded-md"
                              onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://placehold.co/200x280/E2E8F0/94A3B8?text=Error&font=lora';
                              }}
                          />
                          <p className="absolute top-4 left-4 text-xs text-slate-600 transform -rotate-90 origin-top-left whitespace-nowrap -translate-x-full ml-2 md:ml-0" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                              Шакарім Құдайбердіұлы
                          </p>
                          <p className="mt-4 text-xl font-semibold text-slate-700">Жастарға</p>
                      </div>
                  </div>

                  <div className="flex-grow mt-6 md:mt-0 text-center md:text-left">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4 md:mb-6 leading-tight">
                          Открой мир книг - найди свою историю
                      </h1>
                      <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                          Тысячи книг ждут нового читателя.
                          <br className="hidden sm:block" />
                          История, фантастика, психология и многое другое - выбери, что вдохновит именно тебя.
                      </p>
                  </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12">
                  {categories && categories.slice(0,4).map((category) => (
                      <div
                          key={category.name}
                          className="bg-slate-50 hover:bg-slate-200 transition-colors duration-300 rounded-lg shadow-md p-4 flex flex-col items-center justify-center aspect-square text-center cursor-pointer"
                      >
                          <img
                              src={category.image}
                              alt={category.name}
                              className="w-16 h-16 md:w-20 md:h-20 mb-3 rounded-md object-cover"
                              onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://placehold.co/80x80/E2E8F0/94A3B8?text=Error&font=lora`;
                              }}
                          />
                          {/* Fallback icon if image fails, or use icons directly */}
                          {/* {category.icon} */}
                          <p className="text-sm md:text-base font-medium text-slate-700">{category.name}</p>
                      </div>
                  ))}
              </div>

              {/* Catalog Button */}
              <div className="text-center">
                  <button className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-300 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50">
                      <Search size={20} className="inline mr-2 -mt-1" />
                      Перейти в каталог
                  </button>
              </div>
          </div>
      </HomePageSectionContainer>
    )
}



