import {Link, useNavigate} from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore";
import {useNotificationStore} from "../store/useNotificationStore";
import {LogIn, LogOut, Settings, Bell, MessageSquare, Repeat} from "lucide-react";
import {useTranslation} from "react-i18next";

// Helper component to render different icons based on notification type
const NotificationIcon = ({type}) => {
    switch (type) {
        case 'message':
            return <MessageSquare className="w-5 h-5 text-blue-500"/>;
        case 'exchange':
        case 'exchange_update':
            return <Repeat className="w-5 h-5 text-green-500"/>;
        default:
            return <Bell className="w-5 h-5 text-gray-500"/>;
    }
};

const Navbar = () => {
    const {logout, authUser} = useAuthStore();
    const {notifications, unreadCount, markAsRead} = useNotificationStore();
    const navigate = useNavigate();
    const {t, i18n} = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };


    const handleNotificationClick = (notification) => {

        if (!notification.read) {
            markAsRead(notification.id);
        }

        if (notification.user && notification.user._id) {
            navigate('/chat', {state: {preselectedUserId: notification.user._id}});
        }
    };

    const protectRoles = ["admin", "moderator"];

    return (
        <header className="w-full bg-base-100 border-b border-base-300 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <img src='/logo.svg' alt="Logo"/>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to='/' className='text-lg leading-6'>{t('Домашняя страница')}</Link>
                        <Link to='/blog' className='text-lg leading-6'>{t('Блог')}</Link>
                        <Link to='/catalog' className='text-lg leading-6'>{t('Каталог')}</Link>
                        <Link to='/chat' className='text-lg leading-6'>{t('Сообщения')}</Link>
                        <Link to='/exchange' className='text-lg leading-6'>{t('Обмен')}</Link>
                        {authUser && protectRoles.includes(authUser.role) && (
                            <Link to='/admin' className='text-lg leading-6'>{t('Админка')}</Link>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="dropdown dropdown-end">
                            <button tabIndex={0} className="btn btn-ghost btn-sm">
                                {i18n.language.toUpperCase()}
                            </button>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                                <li>
                                    <button onClick={() => changeLanguage('en')}>English</button>
                                </li>
                                <li>
                                    <button onClick={() => changeLanguage('ru')}>Русский</button>
                                </li>
                                <li>
                                    <button onClick={() => changeLanguage('kz')}>Қазақша</button>
                                </li>
                            </ul>
                        </div>

                        {authUser ? (
                            <>

                                <div className="dropdown dropdown-end">
                                    <button tabIndex={0} className="btn btn-ghost btn-circle">
                                        <div className="indicator">
                                            <Bell className="h-5 w-5"/>
                                            {unreadCount > 0 && (
                                                <span
                                                    className="badge badge-sm badge-primary indicator-item">{unreadCount}</span>
                                            )}
                                        </div>
                                    </button>
                                    <div tabIndex={0}
                                         className="mt-3 z-[1] card card-compact dropdown-content w-80 bg-base-100 shadow">
                                        <div className="card-body">
                                            <h3 className="font-bold text-lg">Notifications</h3>
                                            <div className="max-h-80 overflow-y-auto divide-y divide-base-200">
                                                {notifications.length > 0 ? (
                                                    notifications.map(n => (
                                                        <div key={n.id} onClick={() => handleNotificationClick(n)}
                                                             className={`p-3 cursor-pointer flex items-start gap-3 transition-colors hover:bg-base-200 ${!n.read ? 'bg-base-100 font-semibold' : 'opacity-70'}`}>
                                                            <div className="mt-1">
                                                                <NotificationIcon type={n.type}/>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm">{n.message}</p>
                                                                <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center p-4 text-sm text-gray-500">You have no new
                                                        notifications.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link to={"/profile"}
                                      className={'h-[48px] w-[48px] rounded-[20px] p-0 hover:bg-[#EAEAEA] flex items-center justify-center'}>
                                    <img src='/userIcon.svg' alt="User Icon"/>
                                </Link>
                                <button className="flex gap-2 items-center" onClick={logout}>
                                    <LogOut className="size-5"/>
                                    <span className="hidden sm:inline">{t("Выйти")}</span>
                                </button>
                            </>
                        ) : (
                            <Link to={"/login"} className="btn btn-sm gap-2 transition-colors">
                                <LogIn className="w-4 h-4"/>
                                <span className="hidden sm:inline">{t("Войти")}</span>
                            </Link>
                        )}
                        <Link to={"/settings"} className="btn btn-sm btn-circle btn-ghost">
                            <Settings className="w-4 h-4"/>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Navbar;
