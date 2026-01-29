import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaTag, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import axios from 'axios';

const ServiceCard = ({ service, refreshServices }) => {
    const { user } = useAuth();
    const isOwner = user && service.providerId && (service.providerId._id === user._id || service.providerId === user._id);
    const isAdmin = user && user.role === 'admin';

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ยีนยันลบ',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                await axios.delete(`http://localhost:5000/api/services/${service._id}`, config);
                Swal.fire('ลบสำเร็จ!', 'โพสต์ของคุณถูกลบเรียบร้อยแล้ว', 'success');

                if (refreshServices) refreshServices();
            } catch (error) {
                const message = error.response?.data?.message || 'ไม่สามารถลบโพสต์ได้';
                Swal.fire('ข้อผิดพลาด', message, 'error');
            }
        }
    };

    return (
        <div className="card w-full bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <figure className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute top-4 right-4 badge badge-primary font-bold p-4 shadow-lg border-none">
                    {service.price} ฿/วัน
                </div>
            </figure>
            <div className="card-body p-5">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="card-title text-lg font-bold line-clamp-1" title={service.title}>{service.title}</h2>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                    {service.serviceTypes && service.serviceTypes.length > 0 ? (
                        service.serviceTypes.map((type, index) => (
                            <div key={index} className="badge badge-outline gap-1 text-[10px] sm:text-xs">
                                <FaTag /> {type}
                            </div>
                        ))
                    ) : (
                        <div className="badge badge-outline gap-1 text-xs">
                            <FaTag /> {service.category}
                        </div>
                    )}

                    {service.location && (
                        <div className="badge badge-ghost gap-1 text-xs text-secondary">
                            <FaMapMarkerAlt /> {service.location}
                        </div>
                    )}
                </div>

                <div className="text-xs text-gray-500 mb-2 font-medium">
                    ผู้โพสต์: <span className="text-primary">{service.providerId?.username || 'ไม่ระบุ'}</span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                    {service.description}
                </p>

                <div className="card-actions justify-between items-center mt-4 border-t pt-4">
                    {(isOwner || isAdmin) ? (
                        <div className="flex gap-2 w-full">
                            <Link
                                to={`/edit-service/${service._id}`}
                                className="btn btn-warning btn-sm btn-outline flex-1"
                            >
                                แก้ไข
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="btn btn-error btn-sm btn-outline flex-1"
                            >
                                <FaTrash /> ลบ
                            </button>
                        </div>
                    ) : (
                        service.isBooked ? (
                            <button className="btn btn-disabled w-full">
                                ถูกจองแล้ว (Unavailable)
                            </button>
                        ) : (
                            <Link to={`/book/${service._id}`} className="btn btn-primary btn-sm w-full">
                                จองทันที
                            </Link>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
