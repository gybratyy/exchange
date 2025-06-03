import {CalendarDays, Loader, Share2, Tag, ThumbsDown, ThumbsUp} from 'lucide-react';
import {useBlogStore} from "../store/useBlogStore.js";
import {useEffect} from "react";
import {useAuthStore} from "../store/useAuthStore.js";
import toast from "react-hot-toast";
import {useParams} from "react-router-dom";


const BlogPage = () => {
    const {id} = useParams();
    const {blog, blogLoading, getBlogById, interact, addView} = useBlogStore()
    const {authUser} = useAuthStore()

    useEffect(() => {
        addView(id)
            .then(() => getBlogById(id))
            .catch(err => console.log(err))
    }, [addView, id, getBlogById]);


    const handleShare = (data) => {
        navigator.clipboard.writeText(data);
        toast.success("Ссылка скопирована в буфер обмена!");
    };

    if (blogLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <Loader className="size-10 animate-spin"/>
                <p className="ml-4 text-lg text-gray-600">Статья загружается ...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-8 text-center">
                <h1 className="text-2xl font-semibold text-red-500">Статья не доступна</h1>
            </div>
        );
    }


    return (

        <div className="bg-gray-100 text-gray-800 min-h-screen py-8">
            <div className="w-[65%] mx-auto px-4">

                <article className="bg-white p-4 rounded-xl">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6 m-2">
                        <div className="flex items-center mb-2 sm:mb-0">
                            <img
                                src={blog?.author?.profilePic || "https://placehold.co/40x40/cccccc/ffffff?text=A"}
                                alt={blog?.author?.fullName || "Author"}
                                className="w-10 h-10 rounded-full mr-3 border-2 border-indigo-200"
                            />
                            <div>
                                <span
                                    className="font-semibold text-gray-800 text-base">{blog?.author?.fullName || "Loading author..."}</span>
                                <div className="flex items-center text-xs text-gray-400 mt-1">
                                    <CalendarDays size={14} className="mr-1.5"/>
                                    <span>Опубликовано {

                                        new Date(blog?.createdAt).toLocaleTimeString("en-US", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })
                                    }</span>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className="w-full h-72 sm:h-80 md:h-[500px] overflow-hidden bg-gray-200">

                        <img
                            src={blog?.image || ""}
                            alt={blog?.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/1200x600/e2e8f0/64748b?text=Image+Not+Found';
                            }}
                        />
                    </div>

                    <div className="p-6 sm:p-8 md:p-10">


                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {blog?.title}
                        </h1>


                        {blog?.categories?.length > 0 && (
                            <div className="mb-8 flex flex-wrap gap-2">
                                <Tag size={18} className="text-indigo-500 mr-1 mt-1"/>
                                {blog?.categories?.map((category) => (
                                    <span
                                        key={category._id}
                                        className="category-tag bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-indigo-600 hover:text-white"
                                    >
                                        {category?.name || "Loading..."}
                                    </span>
                                ))}
                            </div>
                        )}


                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">

                            {blog?.text?.split('\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>


                        <div
                            className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-4 sm:space-x-6">
                                <button
                                    onClick={() => interact("like", blog._id)}
                                    className={`action-button flex items-center ${blog?.likes?.includes(authUser._id) ? "text-green-500" : "text-gray-600"} hover:text-green-500 transition-colors duration-200`}
                                    aria-label="Like this post"
                                >
                                    <ThumbsUp size={20} className="mr-1.5"/>
                                    <span className="text-sm font-medium">{blog?.likes?.length}</span>
                                </button>
                                <button
                                    onClick={() => interact("dislike", blog._id)}
                                    className={`action-button flex items-center ${blog?.dislikes?.includes(authUser._id) ? "text-red-500" : "text-gray-600"} hover:text-red-500 transition-colors duration-200`}
                                    aria-label="Dislike this post"
                                >
                                    <ThumbsDown size={20} className="mr-1.5"/>
                                    <span className="text-sm font-medium">{blog?.dislikes?.length}</span>
                                </button>

                            </div>
                            <button
                                onClick={() => handleShare(`https://diploma-hgwp.onrender.com/blog/${blog._id}`)}
                                className="action-button flex items-center text-gray-600 hover:text-indigo-500 transition-colors duration-200"
                                aria-label="Share this post"
                            >
                                <Share2 size={20} className="mr-1.5"/>
                                <span className="text-sm font-medium">Поделиться</span>
                            </button>
                        </div>

                    </div>
                </article>
            </div>
        </div>
    );
};


export default BlogPage;


