import {Link} from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore";
import {LogIn, LogOut, Settings, User} from "lucide-react";

const Navbar = () => {
    const {logout, authUser} = useAuthStore();

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
