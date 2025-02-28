import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';

const MainLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Mobile Menu Button */}
            <button
                className="fixed z-50 bottom-4 right-4 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? (
                    <XIcon className="h-6 w-6" />
                ) : (
                    <MenuIcon className="h-6 w-6" />
                )}
            </button>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            <Header />
            
            <main className="flex-grow">
                <div className="container-custom py-8">
                    <Outlet />
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default MainLayout;