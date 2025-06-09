import {useState} from 'react';
import {useReportStore} from '../store/useAdminStore';
import {Flag, Loader, X} from 'lucide-react';
import toast from "react-hot-toast";

const ReportModal = ({resourceId, resourceType, onClose}) => {
    const {submitReport, isSubmitting} = useReportStore();
    const [reportCategory, setReportCategory] = useState('');
    const [text, setText] = useState('');

    const reportCategories = ["Spam", "Inappropriate Content", "Harassment", "Copyright Infringement", "Other"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reportCategory || !text) {
            alert("Please select a category and provide a reason.");
            return;
        }
        try {
            await submitReport({resourceId, resourceType, reportCategory, text});
            onClose();
        } catch (error) {
            console.error("Error submitting report:", error);
            toast.error("Failed to submit report. Please try again later.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-base-100 rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
                    <X/>
                </button>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Flag/> Report Content</h3>
                    <div>
                        <label className="label">
                            <span className="label-text">Reason for reporting</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={reportCategory}
                            onChange={e => setReportCategory(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a category</option>
                            {reportCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Additional details</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder="Please provide more information..."
                            rows={4}
                            value={text}
                            onChange={e => setText(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn btn-error" disabled={isSubmitting}>
                            {isSubmitting && <Loader className="animate-spin mr-2"/>}
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
