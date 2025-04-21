import {BookCard} from "../components/BookCard.jsx";
import {useBookStore} from "../store/useBookStore.js";
import {useEffect} from "react";


const Catalog = () => {
    const {books, getBooks} = useBookStore();

    useEffect(() => {
        getBooks()
    }, [getBooks]);
    return (
        <section className={'grid grid-cols-6 gap-6 pt-20 w-[80%]  mx-auto'}>
            {
                books.map((book) => {
                    return (
                        <BookCard key={book._id} book={book} />
                    )
                })
            }
        </section>
    )
}


export default Catalog;