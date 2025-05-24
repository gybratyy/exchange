import {HomePageSectionContainer} from "../../components/HomePageSectionContainer.jsx";
import {BookCard} from "../../components/BookCard.jsx";
import {useBookStore} from "../../store/useBookStore.js";

export const RecentBooksSection = () => {
    const {books} = useBookStore();
    return(
        <HomePageSectionContainer name='Недавно добавленные книги' link='/preferences'>
            <div className=" h-[100%]  grid grid-cols-12 gap-6 pt-10 ">
                {
                    books.map((book) => {
                        return (
                            <BookCard key={book._id} book={book} />
                        )
                    })
                }
            </div>
        </HomePageSectionContainer>
    )
}