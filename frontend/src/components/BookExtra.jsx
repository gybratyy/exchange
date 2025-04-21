import {useBookStore} from "../store/useBookStore.js";
import {useState} from "react";
import {BookCard} from "./BookCard.jsx";




export const BookExtra = () => {
    const {similarBooks} = useBookStore()

    const [activeTab, setActiveTab] = useState('similarBooks')
    const TABS = {
        similarBooks: (
            <section className={'grid grid-cols-4 gap-6 pt-4 mx-auto'}>
                {
                    similarBooks.map((book) => {
                        return (
                            <BookCard key={book._id} book={book} />
                        )
                    })

                }
                similarBooks
            </section>
        ),
        reviews: (<div>reviews</div>),
        community:  (<div>community</div>)
    }
    return (
       <><div className='pt-8 flex flex-wrap gap-4'>

           <button className={`btn btn-outline  rounded-[12px] px-4 ${activeTab==="similarBooks" ? "btn-active" : ""}`} onClick={() => setActiveTab('similarBooks')}>
               Похожие книги
           </button>
           <button className={`btn btn-outline  rounded-[12px] px-4 ${activeTab==="reviews" ? "btn-active" : ""}`} onClick={() => setActiveTab('reviews')}>
               Отзывы
           </button>
           <button className={`btn btn-outline  rounded-[12px] px-4 ${activeTab==="community" ? "btn-active" : ""}`} onClick={() => setActiveTab('community')}>
               Сообщество
           </button>



       </div>
              <div className='pt-8'>
                {TABS[activeTab]}
              </div>
       </>
    )
}