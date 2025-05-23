export const Dropdown = ({ options, selected, onChange, placeholder, disabled = false }) => (
    <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
        disabled={disabled}
    >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
            <option key={typeof opt === 'object' ? opt.value : opt} value={typeof opt === 'object' ? opt.value : opt}>
                {typeof opt === 'object' ? opt.label : opt}
            </option>
        ))}
    </select>
);
