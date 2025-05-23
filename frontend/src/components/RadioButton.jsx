export const RadioButton = ({ label, name, value, checked, onChange }) => (
    <label className="flex items-center space-x-2 text-sm text-slate-700 hover:text-slate-900 cursor-pointer">
        <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            className="form-radio h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
        />
        <span>{label}</span>
    </label>
);
