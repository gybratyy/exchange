// frontend/src/pages/Chat.jsx
import {useChatStore} from "../store/useChatStore";
import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import {useAuthStore} from "../store/useAuthStore";

const Chat = () => {
    const {selectedUser, setSelectedUser} = useChatStore();
    const {authUser} = useAuthStore();
    const location = useLocation();


    useEffect(() => {
        const navState = location.state;
        if (navState?.preselectedUserId && authUser) {

            const users = useChatStore.getState().users;
            let userToSelect = users.find(u => u._id === navState.preselectedUserId);

            if (userToSelect) {
                setSelectedUser(userToSelect);
            } else {

                console.warn("Preselected user not immediately found in sidebar list. Ensure users are loaded.");
            }
        }

    }, [location.state, setSelectedUser, authUser]);


    return (
        <div className="fixed inset-0 ">
            <div className="flex items-center justify-center pt-20 px-4 h-full">
                <div className=" rounded-lg shadow-xl w-[80%] h-[calc(100vh-8rem)]">
                    <div className="flex gap-3 h-full rounded-lg overflow-hidden">
                        <Sidebar />
                        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                    </div>
                </div>
            </div>
        </div>
    );

};
export default Chat;