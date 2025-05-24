import {useEffect, useState} from 'react';
import {LayoutGrid, List, Loader, MessageSquare, Plus, X} from 'lucide-react';
import {useBlogStore} from "../store/useBlogStore.js";
import {BlogPostCard} from "../components/BlogPostCard.jsx";
import {useAuthStore} from "../store/useAuthStore.js";
import {BlogForm} from "../components/BlogForm.jsx";


const BlogsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const {getAllBlogs, blogs, blogsLoading, blog} = useBlogStore();
    const {interact} = useBlogStore();
    const {authUser} = useAuthStore();
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                await getAllBlogs()
            } catch (error) {
                console.error("Error fetching blog:", error);
            }
        };
        fetchBlog();
    }, [getAllBlogs, blog]);
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);


    if (blogsLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader className="size-10 animate-spin"/>
                <p className="ml-3 text-gray-700">Загрузка статей...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">

                <div className="mb-8  w-full flex items-end justify-between gap-4">
                    <h1 className='text-5xl font-medium'>Статьи</h1>

                    <div className="flex bg-white p-1 rounded-lg shadow">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                            aria-label="Grid view"
                        >
                            <LayoutGrid size={20}/>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                            aria-label="List view"
                        >
                            <List size={20}/>
                        </button>
                        <button
                            onClick={openModal}
                            className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg shadow hover:bg-indigo-700 transition-colors flex items-center text-sm font-medium">
                            <Plus size={18} className="mr-1.5"/> Добавить
                        </button>
                    </div>


                </div>

                {blogs.length > 0 ? (
                    <div
                        className={`grid gap-6 lg:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                        {blogs.map(post => (
                            <BlogPostCard key={post._id} post={post} interact={interact} authUser={authUser}/>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <MessageSquare size={48} className="mx-auto text-gray-400 mb-4"/>
                        <p className="text-xl text-gray-500">Пока нет постов в этой категории.</p>
                    </div>
                )}


            </div>
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300 ease-in-out">
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out scale-100 opacity-100">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Создать новый пост</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={24}/>
                            </button>
                        </div>
                        <div className="overflow-y-auto pr-2 -mr-2 flex-grow">
                            <BlogForm closeModal={closeModal}/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default BlogsPage;