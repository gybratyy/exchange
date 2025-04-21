import { useParams } from 'react-router-dom';
import { useBookStore } from "../store/useBookStore.js";
import {useEffect, useState} from "react";
import { ArrowDownUpIcon, HeartIcon, EllipsisIcon} from "lucide-react";
import {BookExtra} from "../components/BookExtra.jsx";

const BookPage = () => {
    const { id } = useParams();
    const { getBookById, book,books } = useBookStore();

    useEffect(() => {
        getBookById(id)
    }, [getBookById, id]);
    return (
        <section className={'flex flex-col items-center max-w-[80%] justify-center pt-20 px-4 mx-auto'}>
            <div className='w-full grid grid-cols-12 gap-10 '>
                <div className='col-span-3 h-[200px]'>
                    <img  src={'https://simg.marwin.kz/media/catalog/product/cache/41deb699a7fea062a8915debbbb0442c/c/o/cover1__w600_107_25.jpg'} alt='book cover' className='rounded-xl w-350 h-500'/>
                </div>
                <div className='col-span-7 h-[200px] '>
                    <p className={'text-[#707070] text-xl'}>{book.author}</p>
                    <h2 className={'font-bold text-5xl'}>{book.title}</h2>
                    <div className='pt-4 flex gap-4'>
                        <button className="btn rounded-[20px] px-4 ">
                            <ArrowDownUpIcon/>
                            Обменять
                        </button>
                        <button className="btn rounded-[20px] px-3 ">
                            <HeartIcon/>
                        </button>
                        <button className="btn rounded-[20px] px-3 ">
                            <EllipsisIcon/>
                        </button>
                    </div>
                    <p className='pt-4 text-black text-base text-justify'>{book.description}</p>
                    <div className='pt-8 flex flex-wrap gap-4'>
                        {book?.categories?.map(c => (
                            <button key={c} className="btn btn-outline  rounded-[12px] px-4 ">
                                {c}
                            </button>
                        ))}


                    </div>

                    <BookExtra/>




                </div>
                <div className='col-span-2 h-[200px] '>
                    <p className={'text-[#707070] text-xl'}>Рейтинг</p>
                    <div className="rating pt-4">
                        <div className="rating">
                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-yellow-300" aria-label="1 star" />
                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-yellow-300" aria-label="2 star" defaultChecked />
                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-yellow-300" aria-label="3 star" />
                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-yellow-300" aria-label="4 star" />
                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-yellow-300" aria-label="5 star" />
                    </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default BookPage;


