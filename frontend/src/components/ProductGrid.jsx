import {ProductCard} from "./ProductCard.jsx";

export const ProductGrid = ({ products }) => {
    if (!products || products.length === 0) {
        return <div className="text-center text-slate-500 py-10 col-span-full">Нет товаров, соответствующих вашим фильтрам.</div>;
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};
