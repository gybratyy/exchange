import {useEffect, useRef, useState} from 'react';
import {useBlogStore} from '../store/useBlogStore';
import {useBookStore} from '../store/useBookStore';
import toast from 'react-hot-toast';
import {ChevronDown, UploadCloud, XCircle} from 'lucide-react';

export const BlogForm = ({closeModal}) => {
    const {createBlog} = useBlogStore();
    const {categories: availableCategoriesFromStore, getCategories} = useBookStore();

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [imageBase64, setImageBase64] = useState('');

    const [selectedCategories, setSelectedCategories] = useState([]);

    const fileInputRef = useRef(null);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    useEffect(() => {
        if (getCategories && (!availableCategoriesFromStore || availableCategoriesFromStore.length === 0)) {
            getCategories();
        }
    }, [getCategories, availableCategoriesFromStore]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('Размер файла не должен превышать 5 МБ.');
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Пожалуйста, выберите файл изображения.');
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
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
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !text.trim()) {
            toast.error('Заголовок и текст обязательны для заполнения.');
            return;
        }

        const categoryIdsToSend = selectedCategories.map(c => c._id);

        const newBlogData = {
            title,
            text,
            image: imageBase64 || undefined,
            categories: categoryIdsToSend,
        };

        try {
            const result = await createBlog(newBlogData);
            if (result && (result.success || !result.error || result.data)) {
                toast.success('Блог успешно создан!');
                closeModal();
            } else {
                toast.error(result?.error || 'Не удалось создать блог.');
            }
        } catch (error) {
            console.error("Error creating blog:", error);
            toast.error('Ошибка при создании блога.');
        }
    };

    const selectedCategoryDisplayNames = selectedCategories.map(c => c.name).join(', ');

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-1">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Заголовок <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                    Текст блога <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="text"
                    id="text"
                    rows="6"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Изображение (необязательно, до 5МБ)
                </label>
                <div className="mt-1 flex flex-col items-center">
                    <div
                        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex justify-center items-center cursor-pointer hover:border-indigo-500 transition-colors relative group bg-gray-50"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Предпросмотр"
                                     className="max-h-full max-w-full object-contain rounded-md"/>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage();
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                    aria-label="Remove image"
                                >
                                    <XCircle size={20}/>
                                </button>
                            </>
                        ) : (
                            <div className="text-center text-gray-400">
                                <UploadCloud size={40} className="mx-auto mb-2"/>
                                <p className="text-sm">Нажмите, чтобы загрузить</p>
                                <p className="text-xs">PNG, JPG, GIF до 5МБ</p>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/png, image/jpeg, image/gif"
                        className="hidden"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Категории (необязательно)
                </label>
                <div className="relative">
                    <button
                        type="button"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm flex justify-between items-center"
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    >
                        <span className={selectedCategories.length > 0 ? "text-gray-900" : "text-gray-400"}>
                            {selectedCategories.length > 0 ? selectedCategoryDisplayNames : 'Выберите категории'}
                        </span>
                        <ChevronDown size={20}
                                     className={`text-gray-400 transition-transform ${showCategoryDropdown ? 'transform rotate-180' : ''}`}/>
                    </button>
                    {showCategoryDropdown && (
                        <div
                            className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {availableCategoriesFromStore && availableCategoriesFromStore.length > 0 ? (
                                availableCategoriesFromStore.map(category => (
                                    <label
                                        key={category._id}
                                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.some(c => c._id === category._id)}
                                            onChange={() => handleCategoryChange(category)} // Pass the whole category object
                                            className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                                        />
                                        {category.name}
                                    </label>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-sm text-gray-500">Категории не найдены</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Создать блог
                </button>
            </div>
        </form>
    );
};