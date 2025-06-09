import {useChatStore} from "../store/useChatStore";
import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import {useAuthStore} from "../store/useAuthStore";
import {useExchangeStore} from "../store/useExchangeStore";

const Chat = () => {
    const {selectedUser, setSelectedUser, users} = useChatStore();
    const {authUser} = useAuthStore();
    const {userExchanges} = useExchangeStore();
    const location = useLocation();

    const [activeExchangeId, setActiveExchangeId] = useState(null);

    useEffect(() => {
        const navState = location.state;
        if (navState?.preselectedUserId && authUser) {
            const userToSelect = users.find(u => u._id === navState.preselectedUserId);
            if (userToSelect) {
                setSelectedUser(userToSelect);
            }
        }
    }, [location.state, setSelectedUser, authUser, users]);


    useEffect(() => {
        if (!selectedUser || !authUser || !userExchanges) {
            setActiveExchangeId(null);
            return;
        }


        const activeExchange = userExchanges.find(ex =>
            (ex.status === 'pending_agreement' || ex.status === 'agreed_pending_confirmation') &&
            (
                (ex.initiatorUser._id === authUser._id && ex.receiverUser._id === selectedUser._id) ||
                (ex.initiatorUser._id === selectedUser._id && ex.receiverUser._id === authUser._id)
            )
        );


        if (activeExchange) {
            setActiveExchangeId(activeExchange._id);
        } else {
            setActiveExchangeId(null);
        }

    }, [selectedUser, userExchanges, authUser]);

    const exchangeIdToRender = location.state?.exchangeId || activeExchangeId;

    return (
        <div className="fixed inset-0 ">
            <div className="flex items-center justify-center pt-20 px-4 h-full">
                <div className=" rounded-lg shadow-xl w-[80%] h-[calc(100vh-8rem)]">
                    <div className="flex gap-3 h-full rounded-lg overflow-hidden">
                        <Sidebar />
                        {!selectedUser
                            ? <NoChatSelected/>
                            : <ChatContainer exchangeId={exchangeIdToRender}/>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Chat;