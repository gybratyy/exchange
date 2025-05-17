import {Link} from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore";
import {LogIn, LogOut, Settings, User} from "lucide-react";

const Navbar = () => {
    const {logout, authUser} = useAuthStore();

    return (
        <header
            className="bg-base-100 border-b border-base-300 sticky w-full top-0 bg-base-100"
        >
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <img src='/logo.svg'/>

                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to='/catalog' className='btn btn-sm'>Catalog</Link>
                        <Link to='/' className='btn btn-sm'>Messages</Link>
                        <Link to='/exchange' className='btn btn-sm'>Exchange</Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            to={"/settings"}
                            className={`
              btn btn-sm gap-2 transition-colors
              
              `}
                        >
                            <Settings className="w-4 h-4"/>
                            <span className="hidden sm:inline">Settings</span>
                        </Link>

                        {authUser ? (
                            <>
                                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                                    <User className="size-5"/>
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>

                                <button className="flex gap-2 items-center" onClick={logout}>
                                    <LogOut className="size-5"/>
                                    <span className="hidden sm:inline">Logout</span>
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
                                <span className="hidden sm:inline">Log In</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Navbar;
