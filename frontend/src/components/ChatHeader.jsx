// frontend/src/components/ChatHeader.jsx
import {ArrowLeft, Loader2, X} from "lucide-react";
import {useAuthStore} from "../store/useAuthStore";
import {useChatStore} from "../store/useChatStore";
import {useExchangeStore} from "../store/useExchangeStore";
import {useEffect} from "react";

const ExchangeInfoCard = ({book, type}) => (
    <div className="p-2 border border-base-300 rounded-md bg-base-200/50 max-w-[180px]">
      <p className="text-xs text-base-content/70 mb-0.5">{type}:</p>
      <img src={book.image} alt={book.title} className="w-full h-20 object-cover rounded-sm mb-1"/>
      <p className="text-xs font-semibold truncate" title={book.title}>{book.title}</p>
      <p className="text-xxs text-base-content/60 truncate">by {book.author}</p>
    </div>
);

const ChatHeader = ({exchangeId}) => { // Receive exchangeId as a prop
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const {
    currentExchangeDetails,
    fetchExchangeDetails,
    isLoadingDetails,
    updateExchangeStatus,
    isLoadingUpdateStatus
  } = useExchangeStore();
  const authUser = useAuthStore.getState().authUser;

  useEffect(() => {
    if (exchangeId && (!currentExchangeDetails || currentExchangeDetails._id !== exchangeId)) {
      fetchExchangeDetails(exchangeId);
    }
  }, [exchangeId, currentExchangeDetails, fetchExchangeDetails]);

  if (!selectedUser) return null;

  const isExchangeChat = currentExchangeDetails &&
      currentExchangeDetails._id === exchangeId &&
      ((currentExchangeDetails.initiatorUser._id === authUser._id && currentExchangeDetails.receiverUser._id === selectedUser._id) ||
          (currentExchangeDetails.receiverUser._id === authUser._id && currentExchangeDetails.initiatorUser._id === selectedUser._id));

  const handleUpdateStatus = async (newStatus) => {
    if (!currentExchangeDetails?._id || isLoadingUpdateStatus) return;
    try {
      await updateExchangeStatus(currentExchangeDetails._id, newStatus);

    } catch (error) {

      console.error("Error updating exchange status from header:", error);
    }
  };

  const renderExchangeActions = () => {
    if (!isExchangeChat || !currentExchangeDetails) return null;

    const {status, initiatorUser, receiverUser} = currentExchangeDetails;
    const isAuthUserInitiator = authUser._id === initiatorUser._id;
    const isAuthUserReceiver = authUser._id === receiverUser._id;

    switch (status) {
      case "pending_agreement":
        return (
            <div className="flex gap-2 mt-1">
              {isAuthUserReceiver && (
                  <>
                    <button className="btn btn-xs btn-success"
                            onClick={() => handleUpdateStatus("agreed_pending_confirmation")}
                            disabled={isLoadingUpdateStatus}>Принять
                    </button>
                    <button className="btn btn-xs btn-error" onClick={() => handleUpdateStatus("declined")}
                            disabled={isLoadingUpdateStatus}>Отклонить
                    </button>
                  </>
              )}
              {isAuthUserInitiator && (
                  <button className="btn btn-xs btn-warning"
                          onClick={() => handleUpdateStatus("cancelled_by_initiator")}
                          disabled={isLoadingUpdateStatus}>Отменить предложение</button>
              )}
            </div>
        );
      case "agreed_pending_confirmation":
        return (
            <div className="flex gap-2 mt-1">
              <button className="btn btn-xs btn-success" onClick={() => handleUpdateStatus("completed")}
                      disabled={isLoadingUpdateStatus}>Подтвердить обмен
              </button>
              <button className="btn btn-xs btn-warning"
                      onClick={() => handleUpdateStatus(isAuthUserInitiator ? "cancelled_by_initiator" : "cancelled_by_receiver")}
                      disabled={isLoadingUpdateStatus}>Отменить обмен
              </button>
            </div>
        );
      case "completed":
        return <p className="text-xs text-success mt-1">Обмен завершен</p>;
      case "declined":
        return <p className="text-xs text-error mt-1">Предложение отклонено</p>;
      case "cancelled_by_initiator":
      case "cancelled_by_receiver":
        return <p className="text-xs text-warning mt-1">Обмен отменен</p>;
      default:
        return null;
    }
  };


  return (
      <div className={`p-3 border-b border-base-300 ${isExchangeChat ? 'pb-2' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedUser(null)} className="lg:hidden btn btn-ghost btn-sm btn-circle">
              <ArrowLeft size={20}/>
            </button>
            <div className="avatar">
              <div className="size-10 rounded-full relative ring ring-primary ring-offset-base-100 ring-offset-1">
                <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName}/>
                {onlineUsers.includes(selectedUser._id) && (
                    <span
                        className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-success ring-2 ring-base-100"/>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium">{selectedUser.fullName}</h3>
              <p className="text-xs text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "В сети" : "Не в сети"}
              </p>
            </div>
          </div>
          <button onClick={() => setSelectedUser(null)} className="hidden lg:block btn btn-ghost btn-sm btn-circle">
            <X size={20}/>
          </button>
        </div>

        {isLoadingDetails && isExchangeChat && (
            <div className="mt-2 flex justify-center"><Loader2 className="animate-spin"/></div>
        )}

        {isExchangeChat && currentExchangeDetails && (
            <div className="mt-2 p-2 border-t border-base-300/50 bg-base-200/30 rounded-md">
              <p className="text-xs font-semibold text-center mb-1.5">
                Обсуждение обмена: <span
                  className="badge badge-sm">{currentExchangeDetails.status.replace(/_/g, ' ')}</span>
              </p>
              <div className="flex justify-around items-start gap-2 text-center">
                <ExchangeInfoCard book={currentExchangeDetails.initiatorBook}
                                  type={currentExchangeDetails.initiatorUser._id === authUser._id ? "Вы предлагаете" : "Вам предлагают"}/>
                <div className="self-center text-xl p-2">⇄</div>
                <ExchangeInfoCard book={currentExchangeDetails.receiverBook}
                                  type={currentExchangeDetails.receiverUser._id === authUser._id ? "Вы хотите получить" : "Хотят получить у вас"}/>
              </div>
              {renderExchangeActions()}
            </div>
        )}
      </div>
  );
};
export default ChatHeader;