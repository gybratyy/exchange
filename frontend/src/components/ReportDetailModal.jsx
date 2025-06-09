import {useEffect, useState} from 'react';
import {useAdminStore} from '../store/useAdminStore';
import {useAuthStore} from '../store/useAuthStore';
import {ArrowUpCircle, Edit, Loader, Shield, Trash2, X} from 'lucide-react';
import {Link} from 'react-router-dom';
import {useBookStore} from "../store/useBookStore.js";
import {useBlogStore} from "../store/useBlogStore.js";

const ReportDetailModal = ({report, onClose}) => {
    const [resource, setResource] = useState(null);
    const [isLoadingResource, setIsLoadingResource] = useState(true);
    const [resolutionNotes, setResolutionNotes] = useState('');

    const {getBookById} = useBookStore();
    const {getBlogById} = useBlogStore();

    const {authUser} = useAuthStore();
    const {updateReportStatus, deleteContent, isLoading: isActionLoading} = useAdminStore();

    useEffect(() => {
        if (report) {
            const fetchResource = async () => {
                setIsLoadingResource(true);
                try {
                    let fetchedResource;
                    if (report.resourceType.toLowerCase() === 'book') {
                        fetchedResource = await getBookById(report.resourceId);
                    } else if (report.resourceType.toLowerCase() === 'blog') {
                        fetchedResource = await getBlogById(report.resourceId);
                    }
                    setResource(fetchedResource);
                } catch (error) {
                    console.error("Failed to fetch resource:", error);
                    setResource(null);
                } finally {
                    setIsLoadingResource(false);
                }
            };
            fetchResource();
        }
    }, [report, getBookById, getBlogById]);

    if (!report) return null;

    const handleAction = async (actionFn) => {
        const success = await actionFn();
        if (success) {
            onClose();
        }
    };
    const getAuthorName = (res) => {
        if (!res) return '...';
        if (res.author && typeof res.author === 'object') return res.author.fullName;
        if (res.owner && typeof res.owner === 'object') return res.owner.fullName;
        return res.author || 'Unknown';
    };


    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Review Report</h2>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost"><X/></button>
                </header>

                <div className="p-6 flex-grow overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Report Details</h3>
                        <div><strong>Category:</strong> <span
                            className="badge badge-error">{report.reportCategory}</span></div>
                        <div><strong>Reported By:</strong> {report.reporterId.fullName}</div>
                        <div><strong>Reason:</strong><p className="p-2 bg-base-200 rounded-md mt-1">{report.text}</p>
                        </div>
                        <h3 className="font-semibold text-lg border-b pb-2 mt-4">Moderation Actions</h3>
                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder="Add resolution notes..."
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                        />
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleAction(() => updateReportStatus(report._id, 'resolved', resolutionNotes))}
                                className="btn btn-success btn-sm" disabled={isActionLoading}><Shield
                                size={16}/> Resolve
                            </button>
                            <button
                                onClick={() => handleAction(() => updateReportStatus(report._id, 'escalated', resolutionNotes))}
                                className="btn btn-warning btn-sm" disabled={isActionLoading}><ArrowUpCircle
                                size={16}/> Escalate
                            </button>
                            {authUser.role === 'admin' && (
                                <button
                                    onClick={() => handleAction(() => deleteContent(report.resourceType, report.resourceId))}
                                    className="btn btn-error btn-sm" disabled={isActionLoading}><Trash2
                                    size={16}/> Delete Content</button>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg border-b pb-2">Content Preview</h3>
                        {isLoadingResource ? <Loader className="animate-spin mt-4"/> : !resource ?
                            <p>Content not found or could not be loaded.</p> : (
                                <div className="mt-2 space-y-2">
                                    <h4 className="text-xl font-bold">{resource.title}</h4>
                                    <p className="text-sm text-base-content/70">by {getAuthorName(resource)}</p>
                                    <img src={resource.image} alt="content" className="max-w-xs rounded-md shadow-lg"/>
                                    <p className="text-sm mt-2 max-h-48 overflow-y-auto bg-base-200 p-2 rounded">{resource.description || resource.text}</p>
                                    <Link to={`/${report.resourceType.toLowerCase()}/${report.resourceId}`}
                                          target="_blank" className="btn btn-sm btn-outline mt-4"><Edit size={16}/> View
                                        Content</Link>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetailModal;
