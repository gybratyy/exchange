import {useBookStore} from "../store/useBookStore.js";

export const SimilarBooks = ({ book }) => {
    const {book} = useBookStore()

    return (
        <div> similar books</div>
    )
}