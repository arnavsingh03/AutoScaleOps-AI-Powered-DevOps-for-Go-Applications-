import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import RestaurantManagement from '../../components/admin/RestaurantManagement';
import TableManagement from '../../components/admin/TableManagement';
import BookingManagement from '../../components/admin/BookingManagement';

const AdminDashboard = () => {
    const tabs = [
        { name: 'Restaurants', component: RestaurantManagement },
        { name: 'Tables', component: TableManagement },
        { name: 'Bookings', component: BookingManagement },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            
            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.name}
                            className={({ selected }) =>
                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                ${selected
                                    ? 'bg-white text-blue-700 shadow'
                                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                }`
                            }
                        >
                            {tab.name}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className="mt-6">
                    {tabs.map((tab, idx) => (
                        <Tab.Panel key={idx}>
                            <tab.component />
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default AdminDashboard;