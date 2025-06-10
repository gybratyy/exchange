import React from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';


const Footer = () => {
    const {t} = useTranslation();

    const navLinks = [
        {name: t("Домашняя страница"), path: "/"},
        {name: t("Каталог"), path: "/catalog"},
        {name: t("Сообщество"), path: "/community"}, // New key
        {name: t("Блог"), path: "/blog"},
        {name: t("Сообщения"), path: "/chat"},
    ];

    return (
        <footer className="text-white bg-[#11131A]">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col items-center text-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 mb-6">
                        <img src="/logo.png" alt="Book Exchange Logo" className="w-12 h-12"/>
                        <span className="text-2xl font-bold">Book Exchange</span>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Social Icons */}
                    <div className="flex justify-center gap-6 mb-8">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                           className="text-gray-400 hover:text-white transition-colors duration-300">
                            <img src='/instagram.svg'/>
                        </a>
                        <a href="https://telegram.org" target="_blank" rel="noopener noreferrer"
                           className="text-gray-400 hover:text-white transition-colors duration-300">
                            <img src='/telegram.svg'/>
                        </a>
                    </div>
                </div>

                {/* Divider and Copyright */}
                <hr className="border-gray-700"/>
                <p className="text-center text-gray-500 text-sm mt-8">
                    {t("Copyright © 2024, Book Exchange")}
                </p>
            </div>
        </footer>
    );
};

export default Footer;
