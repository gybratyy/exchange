export const Checkbox = ({ label, checked, onChange, flag }) => (
    <label className="flex items-center space-x-2 text-sm text-slate-700 hover:text-slate-900 cursor-pointer">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="form-checkbox h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
        />
        <span>{label}</span>
        {flag && <span className="text-xs">{flag}</span>}
    </label>
);
