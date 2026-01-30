import { useState, useEffect } from 'react';

import { Link, useSearchParams } from 'react-router-dom';
import PostService from '../services/post.service';
import { FaPaw } from 'react-icons/fa';

const Home = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchParams] = useSearchParams();

    // Get search query from URL
    const searchQuery = searchParams.get('search') || '';

    const filters = ['All', 'Pet Boarding', 'Pet Sitting', 'Dog Walking', 'Grooming', 'Training'];
    const filterLabels = {
        'All': 'ทั้งหมด',
        'Pet Boarding': 'รับฝากเลี้ยง',
        'Pet Sitting': 'พี่เลี้ยงสัตว์',
        'Dog Walking': 'พาสุนัขเดินเล่น',
        'Grooming': 'อาบน้ำตัดขน',
        'Training': 'ฝึกสุนัข'
    };

    const fetchServices = async () => {
        try {
            const { data } = await PostService.getAllPosts();
            setServices(data);
            setFilteredServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = services;

        // Filter by Category
        if (activeFilter !== 'All') {
            result = result.filter(service =>
                service.serviceTypes?.includes(activeFilter) || service.category === activeFilter
            );
        }

        // Filter by Search Query (from URL)
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(service =>
                service.title.toLowerCase().includes(lowerQuery) ||
                service.location.toLowerCase().includes(lowerQuery)
            );
        }

        setFilteredServices(result);
    }, [activeFilter, searchQuery, services]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 font-sans pb-20">
            {/* 1. Hero Section */}
            <div className="bg-gradient-to-b from-purple-50 to-white pt-16 pb-12 rounded-b-[3rem] shadow-sm mb-10">
                <div className="container mx-auto px-4 text-center">

                    {/* Main Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-4 leading-tight">
                        ดูแลสัตว์เลี้ยงแสนรัก <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                            ด้วยใจที่คุณวางใจได้
                        </span>
                    </h1>

                    {/* Sub-headline */}
                    <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto font-medium">
                        ยินดีต้อนรับสู่ <span className="text-primary font-bold">Meaw Meal</span>.
                        แหล่งรวมพี่เลี้ยงสัตว์มืออาชีพ บริการฝากเลี้ยง พาสุนัขเดินเล่น และอาบน้ำตัดขน ใกล้บ้านคุณ
                    </p>

                    {/* Old Search Bar & Stats Removed as per request */}

                </div>
            </div>

            {/* 2. Filter Section & Content */}
            <div className="container mx-auto px-4">

                {/* Filter Section (Pill Buttons) */}
                <div className="flex overflow-x-auto gap-3 pb-4 mb-4 justify-start md:justify-center scrollbar-hide">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`btn btn-sm rounded-full border-none px-6 font-medium transition-all whitespace-nowrap ${activeFilter === filter
                                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {filterLabels[filter]}
                        </button>
                    ))}
                </div>

                {/* Section Title */}
                <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        บริการยอดนิยม
                    </h2>
                </div>

                {/* Service Grid */}
                {filteredServices.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <FaPaw className="mx-auto text-6xl text-gray-200 mb-4" />
                        <p className="text-xl text-gray-400 font-medium">No services found.</p>
                        <p className="mt-2 text-gray-400">Try changing your filters or search terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map((service) => (
                            <ServiceCard
                                key={service._id}
                                service={service}
                                refreshServices={fetchServices}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
