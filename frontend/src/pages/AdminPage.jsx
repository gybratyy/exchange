import {useEffect, useMemo, useState} from 'react';
import {useAdminStore} from '../store/useAdminStore';
import {useAuthStore} from '../store/useAuthStore';
import {Clock, Inbox, Loader, ShieldCheck, UserCheck} from 'lucide-react';
import ReportDetailModal from '../components/ReportDetailModal';

const ReportCard = ({report, onReview}) => {
    const {claimReport, isLoading: isClaiming} = useAdminStore();

    const handleClaim = async (e) => {
        e.stopPropagation();
        const claimedReport = await claimReport(report._id);
        if (claimedReport) {
            onReview(claimedReport);
        }
    };

    return (
        <div
            onClick={() => onReview(report)}
            className="bg-base-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-warning cursor-pointer"
        >
            <div className="flex justify-between items-start">
                <div>
                    <span className="font-bold text-lg">{report.reportCategory}</span>
                    <p className="text-sm text-base-content/70">
                        Content: <a href={`/${report.resourceType.toLowerCase()}/${report.resourceId}`} target="_blank"
                                    rel="noopener noreferrer"
                                    className="link link-primary">{report.resourceType} ({report.resourceId})</a>
                    </p>
                </div>
                <div className="text-xs text-base-content/60 flex items-center gap-1">
                    <Clock size={14}/>
                    {new Date(report.createdAt).toLocaleString()}
                </div>
            </div>
            <p className="my-3 p-3 bg-base-100 rounded-md text-sm italic">{report.text}</p>
            <div className="flex justify-between items-end">
                <p className="text-xs">By: {report.reporterId.fullName}</p>
                {report.assignedModerator ? (
                    <div className="badge badge-info gap-1">
                        <UserCheck size={14}/>
                        Claimed by {report.assignedModerator.fullName}
                    </div>
                ) : (
                    <button
                        className="btn btn-sm btn-outline btn-primary"
                        onClick={handleClaim}
                        disabled={isClaiming}
                    >
                        {isClaiming ? <Loader className="animate-spin"/> : "Claim & Review"}
                    </button>
                )}
            </div>
        </div>
    );
};

const AdminPage = () => {
    const {reports, fetchReports, isLoading} = useAdminStore();
    const {authUser} = useAuthStore();
    const [currentTab, setCurrentTab] = useState('new');
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        fetchReports('');
    }, [fetchReports]);

    const {newReports, myQueue} = useMemo(() => {
        const newReports = reports.filter(r => !r.assignedModerator);
        const myQueue = reports.filter(r => r.assignedModerator?._id === authUser._id);
        return {newReports, myQueue};
    }, [reports, authUser]);

    const tabs = {
        new: newReports,
        mine: myQueue,
        all: reports
    };

    const currentReports = tabs[currentTab];

    return (
        <>
            <div className="container mx-auto p-4 pt-24 max-w-4xl">
                <div className="flex items-center gap-4 mb-6">
                    <ShieldCheck className="w-10 h-10 text-primary"/>
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-base-content/70">Content Moderation & Reports</p>
                    </div>
                </div>

                <div role="tablist" className="tabs tabs-bordered mb-4">
                    <a role="tab" className={`tab ${currentTab === 'new' ? 'tab-active' : ''}`}
                       onClick={() => setCurrentTab('new')}>New Reports ({newReports.length})</a>
                    <a role="tab" className={`tab ${currentTab === 'mine' ? 'tab-active' : ''}`}
                       onClick={() => setCurrentTab('mine')}>My Queue ({myQueue.length})</a>
                    <a role="tab" className={`tab ${currentTab === 'all' ? 'tab-active' : ''}`}
                       onClick={() => setCurrentTab('all')}>All Active ({reports.length})</a>
                </div>

                {isLoading && reports.length === 0 ? (
                    <div className="flex justify-center items-center py-20"><Loader
                        className="w-12 h-12 animate-spin text-primary"/></div>
                ) : currentReports.length === 0 ? (
                    <div className="text-center py-20">
                        <Inbox className="w-20 h-20 mx-auto text-base-300"/>
                        <p className="mt-4 text-xl font-semibold">All clear!</p>
                        <p className="text-base-content/70">No reports in this queue.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {currentReports.map(report => (
                            <ReportCard key={report._id} report={report} onReview={setSelectedReport}/>
                        ))}
                    </div>
                )}
            </div>

            {selectedReport && (
                <ReportDetailModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </>
    );
};

export default AdminPage;
