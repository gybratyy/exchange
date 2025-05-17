import {BookCard} from "../components/BookCard.jsx";
import {useBookStore} from "../store/useBookStore.js";
import {useEffect} from "react";
import {CircleMinus, CirclePlus, Loader2} from "lucide-react";


const Catalog = () => {
    const {books, getBooks} = useBookStore();

    useEffect(() => {
        getBooks()
    }, [getBooks]);
    return (

    <div className="min-h-screen flex flex-col justify-center items-center p-6 sm:p-12">
      <div className='sticky w-[80%] text-start flex justify-between align-center'><h1 className='font-bold text-3xl'>Recently published books</h1> <button className=' btn btn-outline rounded-3xl btn-xl w-[10%] '>View All</button> </div>
        <div className="w-[80%] h-[100%]  grid grid-cols-12 gap-6 pt-10 ">
            {
                books.map((book) => {
                    return (
                        <BookCard key={book._id} book={book} />
                    )
                })
            }
        </div>
    </div>
    )
}


export default Catalog;