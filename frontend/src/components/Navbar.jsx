import {Link} from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore";
import {Languages, LogIn, LogOut, Settings} from "lucide-react";
import {useTranslation} from "react-i18next";

const Navbar = () => {
    const {logout, authUser} = useAuthStore();
    const {t, i18n} = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng).then(() => console.log(lng));
    };

    return (
        <header
            className="w-full bg-base-100 border-b border-base-300 sticky top-0  z-50"
        >
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <img src='/logo.svg'/>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to='/' className='text-lg leading-6'>Домашняя страница</Link>
                        <Link to='/blog' className='text-lg leading-6'>Блог</Link>
                        <Link to='/catalog' className='text-lg leading-6'>Каталог</Link>
                        <Link to='/chat' className='text-lg leading-6'>Сообщения</Link>
                        <Link to='/exchange' className='text-lg leading-6'>Обмен</Link>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Language Switcher Dropdown */}
                        <div className="dropdown dropdown-end">
                            <button tabIndex={0} className="btn btn-ghost btn-circle">
                                <Languages/>
                            </button>
                            <ul tabIndex={0}
                                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <button onClick={() => changeLanguage('ru')}>Русский</button>
                                </li>
                                <li>
                                    <button onClick={() => changeLanguage('en')}>English</button>
                                </li>
                                <li>
                                    <button onClick={() => changeLanguage('kz')}>Қазақша</button>
                                </li>
                            </ul>
                        </div>
                        {/* ... rest of your navbar (settings, profile, etc.) ... */}
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            to={"/settings"}
                            className={`
              btn btn-sm gap-2 transition-colors
              
              `}
                        >
                            <Settings className="w-4 h-4"/>
                        </Link>

                        {authUser ? (
                            <>
                                <Link to={"/profile"}
                                      className={'h-[48px] w-[48px] rounded-[20px] p-0 hover:bg-[#EAEAEA] flex items-center justify-center'}>
                                    <img src='/userIcon.svg'/>
                                </Link>

                                <button className="flex gap-2 items-center" onClick={logout}>
                                    <LogOut className="size-5"/>
                                    <span className="hidden sm:inline">Выйти</span>
                                </button>
                            </>
                        ):(
                            <Link
                                to={"/login"}
                                className={`
              btn btn-sm gap-2 transition-colors
              
              `}
                            >
                                <LogIn className="w-4 h-4"/>
                                <span className="hidden sm:inline">Зайти</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Navbar;
