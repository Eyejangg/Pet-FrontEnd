import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';

const Home = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/services');
            setServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-primary mb-4">ยินดีต้อนรับสู่ Meaw Meaw</h1>
                <p className="text-lg text-gray-600">หาคนดูแลสัตว์เลี้ยงที่ไว้ใจได้ หรือ <Link to="/create-service" className="link link-primary">สมัครเป็นผู้ดูแล!</Link></p>
            </div>

            {services.length === 0 ? (
                <div className="text-center py-10 bg-base-200 rounded-xl">
                    <p className="text-xl text-gray-500">ยังไม่มีบริการในขณะนี้</p>
                    <p className="mt-2">เป็นคนแรกที่ <Link to="/create-service" className="link link-primary">สร้างโพสต์บริการ!</Link></p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <ServiceCard
                            key={service._id}
                            service={service}
                            refreshServices={fetchServices} // Pass refresh function
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
