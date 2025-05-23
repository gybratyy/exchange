export const PriceRange = ({ min, max, onMinChange, onMaxChange, currentMin, currentMax }) => {
    // Determine a reasonable overall min/max for the slider if not all books have prices
    // or if some types are 'forExchange'/'forFree'
    const displayMin = 0; // Or derive from actual min price
    const displayMax = 100000; // Or derive from actual max price, e.g., Math.max(...books.map(b => b.price || 0), 1000)


    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <input
                    type="number"
                    placeholder="От"
                    value={currentMin === 0 && !onMinChange.called ? '' : currentMin} // Avoid showing 0 initially if not set
                    onChange={(e) => onMinChange(Number(e.target.value))}
                    className="w-1/2 p-2 border border-slate-300 rounded-md shadow-sm text-sm mr-1"
                />
                <input
                    type="number"
                    placeholder="До"
                    value={currentMax === displayMax && !onMaxChange.called ? '' : currentMax} // Avoid showing default max initially if not set
                    onChange={(e) => onMaxChange(Number(e.target.value))}
                    className="w-1/2 p-2 border border-slate-300 rounded-md shadow-sm text-sm ml-1"
                />
            </div>
            <input
                type="range"
                min={displayMin}
                max={displayMax} // Use a sensible max, or derive from data
                value={currentMax}
                onChange={(e) => onMaxChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>{displayMin} тг</span>
                <span>{displayMax} тг</span>
            </div>
        </div>
    );
};
