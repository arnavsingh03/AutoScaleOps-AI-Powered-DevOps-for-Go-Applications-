import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">DiningApp</h3>
                        <p className="text-gray-400">
                            Find and book the best restaurants in your area.
                            Easy table reservations for any occasion.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link 
                                    to="/" 
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/restaurants" 
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Restaurants
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/dashboard" 
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    My Bookings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link 
                                    to="/help" 
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/faq" 
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/contact" 
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact</h4>
                        <div className="space-y-2 text-gray-400">
                            <p>
                                <span className="font-semibold">Email:</span>
                                <br />
                                info@diningapp.com
                            </p>
                            <p>
                                <span className="font-semibold">Phone:</span>
                                <br />
                                +1 (555) 123-4567
                            </p>
                            <p>
                                <span className="font-semibold">Address:</span>
                                <br />
                                123 Restaurant Street
                                <br />
                                Foodie City, FC 12345
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} DiningApp. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link 
                                to="/privacy" 
                                className="text-gray-400 hover:text-white text-sm transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link 
                                to="/terms" 
                                className="text-gray-400 hover:text-white text-sm transition-colors"
                            >
                                Terms of Service
                            </Link>
                            <Link 
                                to="/cookies" 
                                className="text-gray-400 hover:text-white text-sm transition-colors"
                            >
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;