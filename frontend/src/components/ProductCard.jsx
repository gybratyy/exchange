import {Book, FileText, Globe, MapPin, Smile, Star, Tag} from "lucide-react";
import {Link} from "react-router-dom";
import {typeDisplayNames} from "../lib/utils.js";

export const ProductCard = ({ product }) => {
    const getProductIcon = (type) => {
        switch (type) {
            case 'book': return <Book size={14} className="mr-1 text-slate-500" />;
            case 'magazine': return <FileText size={14} className="mr-1 text-slate-500" />;
            case 'comics':
            case 'manga': return <Smile size={14} className="mr-1 text-slate-500" />;
            default: return <Tag size={14} className="mr-1 text-slate-500" />;
        }
    };


    const averageRating = 4/*useMemo(() => {
        if (!product.reviews || product.reviews.length === 0) {
            if (product.rating && typeof product.rating === 'object' && Object.keys(product.rating).length > 0) {
                return 0;
            }
            return 0;
        }
        const totalRating = product.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        return Math.round(totalRating / product.reviews.length);
    }, [product.reviews, product.rating]);*/


    return (
        <div className="bg-white rounded-lg  overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col">
            <div className="relative">
                <img
                    src={product.image || `https://placehold.co/300x450/E2E8F0/4A5568?text=Книга&font=lora`}
                    alt={product.title}
                    className="w-full h-64 object-cover aspect-[3/4]"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x450/CBD5E1/94A3B8?text=Error&font=lora'; }}
                />
                <div
                    className={`absolute top-2 right-2 px-2.5 py-1 text-xs font-semibold text-white rounded-full shadow-md ${
                        typeDisplayNames[product.type].bgColor
                    }`}
                >
                    {typeDisplayNames[product.type].label || product.type} {product.type === 'forSale' && product.price ? `(${product.price} тг)` : ''}
                </div>
                {product.productType && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded flex items-center">
                        {getProductIcon(product.productType)} {product.productType.charAt(0).toUpperCase() + product.productType.slice(1)}
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">

                <Link to={`/catalog/${product._id}`}><h3 className="text-lg font-semibold text-slate-800 mb-1 truncate"
                                                         title={product.title}>
                    {product.title}
                </h3></Link>
                <p className="text-sm text-slate-600 mb-2 truncate" title={product.author}>{product.author}</p>

                {product.language &&
                    <div className="flex items-center text-xs text-slate-500 mb-1">
                        <Globe size={14} className="mr-1" /> {product.language}
                    </div>
                }
                {product.owner && product.owner.city && product.owner.country &&
                    <div className="flex items-center text-xs text-slate-500 mb-3">
                        <MapPin size={14} className="mr-1" /> {product.owner.city}, {product.owner.country}
                    </div>
                }

                <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                className={i < averageRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                            />
                        ))}
                        <span className="text-xs text-slate-500 ml-1">({averageRating > 0 ? averageRating : 'Нет'})</span>
                    </div>
                    {/*<Link to={`/catalog/${product._id}`} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 px-3 rounded-md transition-colors">
                        Детали
                    </Link>*/}
                </div>
            </div>
        </div>
    );
};
