// frontend/src/components/ChatContainer.jsx
import {useChatStore} from "../store/useChatStore";
import {useEffect, useRef} from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import {useAuthStore} from "../store/useAuthStore";
import {formatMessageTime} from "../lib/utils";

const ChatContainer = ({exchangeId}) => {
    const {
        messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        subscribeToMessages,
        unsubscribeFromMessages,
    } = useChatStore();
    const {authUser} = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
            subscribeToMessages();
        }
        return () => {
            if (selectedUser?._id) {
                unsubscribeFromMessages();
            }
        };
    }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages.length > 0) {
            messageEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);

    if (!selectedUser) {
        return null;
    }

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader exchangeId={exchangeId}/>
                <MessageSkeleton/>
                <MessageInput/>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto border-2 rounded-xl bg-[#EAEAEA]">
            {/* 2. Pass the prop to the ChatHeader */}
            <ChatHeader exchangeId={exchangeId}/>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.senderId?._id === authUser._id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.senderId?._id === authUser._id
                                            ? authUser.profilePic || "/avatar.png"
                                            : selectedUser.profilePic || "/avatar.png"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <p className="text-xs opacity-50 ml-1">
                                {message.senderId?.fullName} at {formatMessageTime(message.createdAt)}
                            </p>
                        </div>
                        <div
                            className={`chat-bubble flex flex-col text-primary-content ${message.senderId?._id === authUser._id ? "bg-primary " : "bg-base-300"}`}>
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput/>
        </div>
    );
};
export default ChatContainer;
