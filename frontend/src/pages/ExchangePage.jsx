import {PlusIcon, LayoutGridIcon, LayoutListIcon, MinusIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {useBookStore} from "../store/useBookStore.js";
import {BookCardWithMarks} from "../components/BookCardWithMarks.jsx";

const ExchangePage = () => {
    const [activeTab, setActiveTab] = useState('myBooks')
    const {myBooks, getMyBooks, categories, getCategories} = useBookStore()
    const [isModalOpen, setIsModalOpen] = useState(false);


    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        getMyBooks()
        getCategories()
    }, [getMyBooks, getCategories]);

    const TABS = {
        myBooks: (
            <section className={'grid grid-cols-4 gap-6 pt-4 mx-auto'}>
                {
                    myBooks.map((book) => {
                        return (
                            <BookCardWithMarks key={book._id} book={book}/>
                        )
                    })
                }
            </section>
        ),
        waiting: (<div>waiting</div>),
        sold: (<div>sold</div>)
    }
    return (
        <section className='pt-20 w-[80%] mx-auto'>
            <div className='flex justify-between'>
                <h1 className='text-black text-5xl'>Книгообмен</h1>
                <div className='pt-4 flex gap-4'>
                    <button className="btn rounded-[20px] px-4 flex gap-1">
                        <LayoutGridIcon/>
                        <MinusIcon className="rotate-90"/>
                        <LayoutListIcon/>
                    </button>
                    <button className="btn rounded-[20px] px-3 ">
                        <PlusIcon onClick={openModal}/>
                    </button>

                </div>
            </div>
            <div className='grid grid-cols-12'>
                <div className='col-span-3'>
                    <div className='flex flex-col gap-4 pt-8 '>
                        <button
                            className={`btn btn-outline max-w-[200px] rounded-[12px] px-4 ${activeTab === "myBooks" ? "btn-active" : ""}`}
                            onClick={() => setActiveTab('myBooks')}>
                            Мои книги
                        </button>
                        <button
                            className={`btn btn-outline max-w-[200px] rounded-[12px] px-4 ${activeTab === "waiting" ? "btn-active" : ""}`}
                            onClick={() => setActiveTab('waiting')}>
                            Ожидание
                        </button>
                        <button
                            className={`btn btn-outline max-w-[200px] rounded-[12px] px-4 ${activeTab === "sold" ? "btn-active" : ""}`}
                            onClick={() => setActiveTab('sold')}>
                            Проданные книги
                        </button>
                    </div>

                </div>
                <div className='col-span-8'>
                    {TABS[activeTab]}
                </div>
            </div>


            {isModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div
                        className="relative bg-white p-6 rounded-lg shadow-lg z-50 w-[800px] h-[850px] flex flex-col items-center px-10"
                        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
                    >
                        <div className="flex w-full justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Создать пост</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-red-500 focus:outline-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className={'grid grid-cols-2 w-full gap-8'}>
                            <fieldset className="fieldset w-full">
                                <legend className="fieldset-legend ">Title</legend>
                                <input type={'text'} className={'input w-full'} />
                            </fieldset>
                            <fieldset className="fieldset w-full">
                                <legend className="fieldset-legend ">Author</legend>
                                <input type={'text'} className={'input w-full'} />
                            </fieldset>
                            <fieldset className="fieldset w-full col-span-2 ">
                                <legend className="fieldset-legend ">Description</legend>
                                <textarea rows={2} className={'textarea w-full'} />
                            </fieldset>

                            <fieldset className="fieldset  w-full">
                                <legend className="fieldset-legend ">Publication Date</legend>
                                <input type="date" className="input w-full" />
                            </fieldset><fieldset className="fieldset  w-full">
                                <legend className="fieldset-legend ">Language</legend>
                                <select defaultValue="Pick a browser" className="select w-full ">
                                        <option>Қазақша</option>
                                        <option>English</option>
                                        <option>Русский</option>
                                </select>
                            </fieldset>
                            <fieldset className="fieldset  w-full">
                                <legend className="fieldset-legend">Type</legend>
                                <select defaultValue="Pick a browser" className="select w-full ">
                                    <option>For sale</option>
                                    <option>For exchange</option>
                                    <option>Any</option>
                                    <option>For free</option>
                                </select>
                            </fieldset>
                            <fieldset className="fieldset w-full">
                                <legend className="fieldset-legend ">Price</legend>
                                <input type={'number'} className={'input w-full'} />
                            </fieldset>
                            <fieldset className="fieldset w-full">
                                <legend className="fieldset-legend ">Image</legend>
                                <input type={'file'} className={'file-input w-full'} />
                            </fieldset>
                        </div>
                    </div>
                </div>
            )}
        </section>

    )
}

const Modal = () => {
    <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
}

export default ExchangePage;