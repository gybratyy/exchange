import {useEffect, useState} from 'react';
import {useAdminStore} from '../store/useAdminStore';
import {useAuthStore} from '../store/useAuthStore';
import {Loader, ShieldCheck, UserCheck, Inbox, Clock} from 'lucide-react';

const ReportCard = ({report}) => {
    const {claimReport, isLoading} = useAdminStore();
    const {authUser} = useAuthStore();

    const handleClaim = async (e) => {
        e.stopPropagation();
        await claimReport(report._id);
    };

    const isClaimedByMe = report.assignedModerator?._id === authUser._id;

    return (
        <div
            className="bg-base-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-warning">
            <div className="flex justify-between items-start">
                <div>
                    <span className="font-bold text-lg">{report.reportCategory}</span>
                    <p className="text-sm text-base-content/70">
                        Reported Item: <a href={`/${report.resourceType.toLowerCase()}/${report.resourceId}`}
                                          target="_blank" rel="noopener noreferrer"
                                          className="link link-primary">{report.resourceType}</a>
                    </p>
                </div>
                <div className="text-xs text-base-content/60 flex items-center gap-1">
                    <Clock size={14}/>
                    {new Date(report.createdAt).toLocaleString()}
                </div>
            </div>
            <p className="my-3 p-3 bg-base-100 rounded-md text-sm italic">"{report.text}"</p>
            <div className="flex justify-between items-end">
                <p className="text-xs">Reported by: {report.reporterId.fullName}</p>
                {report.assignedModerator ? (
                    <div className="badge badge-info gap-1">
                        <UserCheck size={14}/>
                        Claimed by {isClaimedByMe ? "you" : report.assignedModerator.fullName}
                    </div>
                ) : (
                    <button
                        className="btn btn-sm btn-outline btn-primary"
                        onClick={handleClaim}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="animate-spin"/> : "Claim"}
                    </button>
                )}
            </div>
        </div>
    );
};

const AdminPage = () => {
    const {reports, fetchReports, isLoading} = useAdminStore();
    const [filter, setFilter] = useState('active');

    useEffect(() => {
        fetchReports(filter);
    }, [filter, fetchReports]);

    return (
        <div className="container mx-auto p-4 pt-24 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <ShieldCheck className="w-10 h-10 text-primary"/>
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-base-content/70">Content Moderation & Reports</p>
                </div>
            </div>


            {isLoading && reports.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                    <Loader className="w-12 h-12 animate-spin text-primary"/>
                </div>
            ) : reports.length === 0 ? (
                <div className="text-center py-20">
                    <Inbox className="w-20 h-20 mx-auto text-base-300"/>
                    <p className="mt-4 text-xl font-semibold">All clear!</p>
                    <p className="text-base-content/70">There are no reports to review right now.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reports.map(report => (
                        <ReportCard key={report._id} report={report}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPage;
