import {useCallback, useEffect, useRef, useState} from 'react';
import {useBookStore} from '../store/useBookStore.js';
import toast from 'react-hot-toast';
import {ChevronDown, UploadCloud, XCircle} from 'lucide-react';

import dayjs from 'dayjs';

export const BookForm = ({closeModal}) => {
    const {book, categories: availableCategoriesFromStore, getCategories, createBook, updateBook} = useBookStore();


    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [publishedDate, setPublishedDate] = useState('');
    const [price, setPrice] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [type, setType] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [status, setStatus] = useState('');
    const [isActive, setIsActive] = useState(true);


    const fileInputRef = useRef(null);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showIsActiveDropdown, setShowIsActiveDropdown] = useState(false);

    const languageOptions = [{label: 'Қазақша'}, {label: 'Русский'}, {label: 'English'}];
    const typeOptions = [
        {value: 'forSale', label: 'На продажу'},
        {value: 'forExchange', label: 'На обмен'},
        {value: 'any', label: 'На обмен / продажу'},
        {value: 'forFree', label: 'Бесплатно'},
    ];

    const statusOptions = [
        {value: "available", label: 'Доступно'},
        {value: "reserved", label: 'Зарезервировано'},
        {value: "in_exchange", label: 'В обмене'},
        {value: "exchanged", label: 'Обменено'},
    ]

    const isActiveOptions = [
        {value: true, label: 'Активно'},
        {value: false, label: 'Неактивно'},
    ]


    useEffect(() => {
        if (book && book._id) {
            setTitle(book.title || '');
            setAuthor(book.author || '');
            setDescription(book.description || '');
            setLanguage(book.language || '');

            setPublishedDate(book.publishedDate ? dayjs(book.publishedDate).format('YYYY-MM-DD') : '');
            setPrice(book.price !== undefined ? String(book.price) : '');
            setImageBase64(book.image || '');
            setImagePreview(book.image || '');
            setType(book.type || '');
            setStatus(book.status || 'available');
            setIsActive(book.isActive !== undefined ? book.isActive : true);

            console.log("book categories:", book.categories);
            console.log("categories from store:", availableCategoriesFromStore);
            if (book.categories && availableCategoriesFromStore.length > 0) {
                const preSelectedCategories = availableCategoriesFromStore.filter(catStore =>
                    (book.categories || []).some(bookCat => typeof bookCat === 'string' ? bookCat === catStore.name : bookCat._id === catStore._id)
                );
                setSelectedCategories(preSelectedCategories);
            } else {
                setSelectedCategories(book.categories || []);
            }


        } else {
            setTitle('');
            setAuthor('');
            setDescription('');
            setLanguage('');
            setPublishedDate('');
            setPrice('');
            setImagePreview('');
            setImageBase64('');
            setType('');
            setSelectedCategories([]);
            setStatus('available');
            setIsActive(true);
        }
    }, [book, availableCategoriesFromStore]);


    useEffect(() => {
        if (getCategories && (!availableCategoriesFromStore || availableCategoriesFromStore.length === 0)) {
            getCategories();
        }
    }, [getCategories, availableCategoriesFromStore]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Размер файла не должен превышать 5 МБ.');
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Пожалуйста, выберите файл изображения.');
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setImageBase64(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview('');
        setImageBase64('');
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories(prevSelected => {
            const isSelected = prevSelected.some(c => c._id === category._id);
            if (isSelected) {
                return prevSelected.filter(c => c._id !== category._id);
            } else {
                return [...prevSelected, category];
            }
        });
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!title.trim() || !author.trim() || !description.trim()) {
            toast.error('Заголовок, автор и описание обязательны.');
            return;
        }

        const categoryIdsToSend = selectedCategories.map(c => c.name);

        const bookDataPayload = {
            title,
            author,
            description,
            language,
            publishedDate: publishedDate ? dayjs(publishedDate).toISOString() : null,
            price: price !== '' ? parseFloat(price) : 0,
            image: imageBase64 || (book && book.image ? book.image : undefined),
            type,
            categories: categoryIdsToSend,
            status,
            isActive
        };

        try {
            if (book && book._id) {
                await updateBook({...bookDataPayload, _id: book._id});
                toast.success('Книга успешно обновлена!');
            } else {
                await createBook(bookDataPayload);
                toast.success('Книга успешно создана!');
            }
            closeModal();
        } catch (error) {
            console.error("Error submitting book form:", error);
            toast.error(error.response?.data?.message || 'Ошибка при сохранении книги.');
        }
    }, [title, author, description, language, publishedDate, price, imageBase64, type, selectedCategories, book, updateBook, createBook, closeModal, isActive, status]);

    const selectedCategoryDisplayNames = selectedCategories.map(c => c.name).join(', ');

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-1 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 ">
                <div>
                    <label htmlFor="title" className="block  font-medium text-gray-700 mb-0.5">
                        Название <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text" name="title" id="title" value={title}
                        onChange={(e) => setTitle(e.target.value)} required
                        className="mt-0.5 block w-full px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:"
                    />
                </div>


                <div>
                    <label htmlFor="author" className="block  font-medium text-gray-700 mb-0.5">
                        Автор <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text" name="author" id="author" value={author}
                        onChange={(e) => setAuthor(e.target.value)} required
                        className="mt-0.5 block w-full px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:"
                    />
                </div>


                <div className="md:col-span-2">
                    <label htmlFor="description" className="block  font-medium text-gray-700 mb-0.5">
                        Описание <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description" id="description" rows="4" value={description}
                        onChange={(e) => setDescription(e.target.value)} required
                        className="mt-0.5 block w-full px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm: resize-none"
                    ></textarea>
                </div>


                <div>
                    <label className="block  font-medium text-gray-700 mb-0.5">Язык</label>
                    <div className="relative">
                        <button type="button"
                                className="mt-0.5 block w-full px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm: flex justify-between items-center"
                                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        >
                            <span className={language ? "text-gray-900" : "text-gray-400"}>
                                {language || 'Выберите язык'}
                            </span>
                            <ChevronDown size={16}
                                         className={`text-gray-400 transition-transform ${showLanguageDropdown ? 'transform rotate-180' : ''}`}/>
                        </button>
                        {showLanguageDropdown && (
                            <div
                                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {languageOptions.map(opt => (
                                    <div key={opt.label}
                                         onClick={() => {
                                             setLanguage(opt.label);
                                             setShowLanguageDropdown(false);
                                         }}
                                         className="px-3 py-1.5  text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="publishedDate" className="block  font-medium text-gray-700 mb-0.5">Дата
                        публикации</label>
                    <input
                        type="date" name="publishedDate" id="publishedDate" value={publishedDate}
                        onChange={(e) => setPublishedDate(e.target.value)}
                        className="mt-0.5 block w-full px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:"
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block  font-medium text-gray-700 mb-0.5">Цена (тг)</label>
                    <input
                        type="number" name="price" id="price" value={price}
                        onChange={(e) => setPrice(e.target.value)} placeholder="0"
                        className="mt-0.5 block w-full px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:"
                    />
                </div>

                <div>
                    <label className="block  font-medium text-gray-700 mb-0.5">Тип объявления</label>
                    <div className="relative">
                        <button type="button"
                                className="mt-0.5 block w-full px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm: flex justify-between items-center"
                                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                        >
                            <span className={type ? "text-gray-900" : "text-gray-400"}>
                                {(typeOptions.find(opt => opt.value === type) || {label: 'Выберите тип'}).label}
                            </span>
                            <ChevronDown size={16}
                                         className={`text-gray-400 transition-transform ${showTypeDropdown ? 'transform rotate-180' : ''}`}/>
                        </button>
                        {showTypeDropdown && (
                            <div
                                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {typeOptions.map(opt => (
                                    <div key={opt.value}
                                         onClick={() => {
                                             setType(opt.value);
                                             setShowTypeDropdown(false);
                                         }}
                                         className="px-3 py-1.5  text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block  font-medium text-gray-700 mb-0.5">Статус книги</label>
                    <div className="relative">
                        <button type="button"
                                className="mt-0.5 block w-full px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm: flex justify-between items-center"
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        >
                            <span className={status ? "text-gray-900" : "text-gray-400"}>
                                {(statusOptions.find(opt => opt.value === status) || {label: 'Выберите статус'}).label}
                            </span>
                            <ChevronDown size={16}
                                         className={`text-gray-400 transition-transform ${showStatusDropdown ? 'transform rotate-180' : ''}`}/>
                        </button>
                        {showStatusDropdown && (
                            <div
                                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {statusOptions.map(opt => (
                                    <div key={opt.value}
                                         onClick={() => {
                                             setStatus(opt.value);
                                             setShowStatusDropdown(false);
                                         }}
                                         className="px-3 py-1.5  text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block  font-medium text-gray-700 mb-0.5">Доступность</label>
                    <div className="relative">
                        <button type="button"
                                className="mt-0.5 block w-full px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm: flex justify-between items-center"
                                onClick={() => setShowIsActiveDropdown(!showIsActiveDropdown)}
                        >
                            <span className={isActive !== null ? "text-gray-900" : "text-gray-400"}>
                                {(isActiveOptions.find(opt => opt.value === isActive) || {label: 'Выберите доступность'}).label}
                            </span>
                            <ChevronDown size={16}
                                         className={`text-gray-400 transition-transform ${showIsActiveDropdown ? 'transform rotate-180' : ''}`}/>
                        </button>
                        {showIsActiveDropdown && (
                            <div
                                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {isActiveOptions.map(opt => (
                                    <div key={opt.value}
                                         onClick={() => {
                                             setIsActive(opt.value);
                                             setShowIsActiveDropdown(false);
                                         }}
                                         className="px-3 py-1.5  text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block  font-medium text-gray-700 mb-0.5">Категории</label>
                    <div className="relative">
                        <button type="button"
                                className="mt-0.5 block w-full px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm: flex justify-between items-center"
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        >
                            <span className={selectedCategories.length > 0 ? "text-gray-900" : "text-gray-400"}>
                                {selectedCategories.length > 0 ? selectedCategoryDisplayNames : 'Выберите категории'}
                            </span>
                            <ChevronDown size={16}
                                         className={`text-gray-400 transition-transform ${showCategoryDropdown ? 'transform rotate-180' : ''}`}/>
                        </button>
                        {showCategoryDropdown && (
                            <div
                                className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                {availableCategoriesFromStore && availableCategoriesFromStore.length > 0 ? (
                                    availableCategoriesFromStore.map(category => (
                                        <label key={category._id}
                                               className="flex items-center px-3 py-1.5  text-gray-700 hover:bg-gray-100 cursor-pointer">
                                            <input type="checkbox"
                                                   checked={selectedCategories.some(c => c._id === category._id)}
                                                   onChange={() => handleCategoryChange(category)}
                                                   className="form-checkbox h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                                            />
                                            {category.name}
                                        </label>
                                    ))
                                ) : (
                                    <div className="px-3 py-1.5  text-gray-500">Категории не найдены</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <label className="block  font-medium text-gray-700 mb-0.5">
                    Изображение (до 5МБ)
                </label>
                <div className="mt-0.5 flex flex-col items-center">
                    <div
                        className="w-full h-40 border-2 border-dashed border-gray-300 rounded-md flex justify-center items-center cursor-pointer hover:border-indigo-500 transition-colors relative group bg-gray-50"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Предпросмотр"
                                     className="max-h-full max-w-full object-contain rounded-md"/>
                                <button type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage();
                                        }}
                                        className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                        aria-label="Remove image"
                                >
                                    <XCircle size={18}/>
                                </button>
                            </>
                        ) : (
                            <div className="text-center text-gray-400">
                                <UploadCloud size={32} className="mx-auto mb-1"/>
                                <p className="">Нажмите, чтобы загрузить</p>
                                <p className="text-xxs">PNG, JPG, GIF до 5МБ</p>
                            </div>
                        )}
                    </div>
                    <input type="file" name="image" id="image" ref={fileInputRef}
                           onChange={handleImageChange} accept="image/png, image/jpeg, image/gif" className="hidden"
                    />
                </div>
            </div>


            <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={closeModal}
                        className="px-3 py-1.5  font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Отмена
                </button>
                <button type="submit"
                        className="px-3 py-1.5  font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {book && book._id ? "Обновить книгу" : "Создать книгу"}
                </button>
            </div>
        </form>
    );
};