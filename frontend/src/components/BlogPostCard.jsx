import {CalendarDays, ThumbsDown, ThumbsUp} from "lucide-react";
import {formatDate} from "../lib/utils.js";


export const BlogPostCard = ({post, interact, authUser}) => {


    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="p-6">
                <div className="flex items-center mb-3">
                    <img
                        src={post.author.profilePic}
                        alt={post.author.fullName}
                        className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200"
                        onError={(e) => {
                            e.target.src = `https://placehold.co/40x40/cccccc/ffffff?text=${post.author.fullName.charAt(0) || 'A'}`;
                        }}
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{post.author.fullName}</p>
                        <p className="text-xs text-gray-500 flex align-baseline">
                            <CalendarDays size={12} className="inline mr-1"/>
                            {formatDate(post.createdAt)}
                        </p>
                    </div>
                </div>

                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 leading-tight hover:text-indigo-600 transition-colors">
                    <a href={`/blog/${post._id}`} className="hover:underline">{post.title}</a>
                </h2>

                {post.categories && post.categories.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {post.categories.slice(0, 3).map((category) => ( // Show max 3 categories
                            <span
                                key={category._id}
                                className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-medium"
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>
                )}

                <p className="text-gray-600 text-sm leading-relaxed mb-4 h-40 overflow-hidden  overflow-ellipsis">
                    {post.text}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => interact("like", post._id)}
                            className={`action-button flex items-center ${authUser && post?.likes?.includes(authUser._id) ? "text-green-500" : "text-gray-600"} hover:text-green-500 transition-colors duration-200`}
                            aria-label="Like this post"
                        >
                            <ThumbsUp size={20} className="mr-1.5"/>
                            <span className="text-sm font-medium">{post?.likes?.length}</span>
                        </button>
                        <button
                            onClick={() => interact("dislike", post._id)}
                            className={`action-button flex items-center ${authUser && post?.dislikes?.includes(authUser._id) ? "text-red-500" : "text-gray-600"} hover:text-red-500 transition-colors duration-200`}
                            aria-label="Dislike this post"
                        >
                            <ThumbsDown size={20} className="mr-1.5"/>
                            <span className="text-sm font-medium">{post?.dislikes?.length}</span>
                        </button>
                    </div>
                    <a
                        href={`/blog/${post._id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                        Читать все
                    </a>
                </div>
            </div>
        </div>
    );
};
