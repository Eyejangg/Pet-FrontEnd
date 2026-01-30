import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaTag, FaTrash, FaUserCircle, FaPen } from 'react-icons/fa';
import { useAuth } from '../services/useAuth';
import PostService from '../services/post.service';
import Swal from 'sweetalert2';


const ServiceCard = ({ service, refreshServices }) => {
    const { user } = useAuth();
    const userId = user?.id || user?._id;
    const providerId = service.providerId?._id || service.providerId;
    const isOwner = user && providerId && (providerId === userId);
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
                const response = await PostService.deletePost(service._id);

                if (response.status === 200) {
                    Swal.fire('ลบสำเร็จ!', 'โพสต์ของคุณถูกลบเรียบร้อยแล้ว', 'success');
                    if (refreshServices) refreshServices();
                }
            } catch (error) {
                const message = error.response?.data?.message || 'ไม่สามารถลบโพสต์ได้';
                Swal.fire('ข้อผิดพลาด', message, 'error');
            }
        }
    };

    return (
        <div className="card w-full bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden group">
            {/* Image Section */}
            <figure className="relative aspect-video w-full overflow-hidden">
                <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Price Badge */}
                <div className="absolute top-3 right-3 bg-indigo-600 text-white font-bold py-1 px-3 rounded-lg shadow-md text-sm">
                    {service.price} ฿/วัน
                </div>
            </figure>

            {/* Content Body */}
            <div className="card-body p-5 gap-3">
                {/* Title */}
                <h2 className="card-title text-xl font-bold text-gray-800 line-clamp-1" title={service.title}>
                    {service.title}
                </h2>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {service.serviceTypes && service.serviceTypes.length > 0 ? (
                        service.serviceTypes.slice(0, 3).map((type, index) => (
                            <div key={index} className="badge badge-ghost badge-sm gap-1 text-xs text-indigo-600 font-medium">
                                <FaTag className="text-[10px]" /> {type}
                            </div>
                        ))
                    ) : (
                        <div className="badge badge-ghost badge-sm gap-1 text-xs text-indigo-600 font-medium">
                            <FaTag className="text-[10px]" /> {service.category}
                        </div>
                    )}
                    {/* Show +N if more than 3 tags */}
                    {service.serviceTypes && service.serviceTypes.length > 3 && (
                        <div className="badge badge-ghost badge-sm text-xs">+{service.serviceTypes.length - 3}</div>
                    )}
                </div>

                {/* Location */}
                {service.location && (
                    <div className="flex items-center gap-1 text-rose-500 text-sm font-medium">
                        <FaMapMarkerAlt />
                        <span>{service.location}</span>
                    </div>
                )}

                {/* Description */}
                <p className="text-gray-500 text-sm line-clamp-2 h-10 leading-relaxed">
                    {service.description}
                </p>

                {/* Poster Info */}
                <div className="flex items-center gap-2 mt-1 pt-3 border-t border-base-200">
                    <FaUserCircle className="text-2xl text-gray-300" />
                    <span className="text-sm text-gray-400 font-medium">
                        User: <span className="text-gray-600">{service.providerId?.username || 'ไม่ระบุ'}</span>
                    </span>
                </div>

                {/* Footer Actions */}
                <div className="card-actions mt-2">
                    {(isOwner || isAdmin) ? (
                        <div className="flex gap-2 w-full">
                            <Link
                                to={`/edit-service/${service._id}`}
                                className="btn btn-ghost btn-sm text-amber-500 hover:bg-amber-50 flex-1 font-normal"
                            >
                                <FaPen className="text-xs" /> แก้ไข
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 flex-1 font-normal"
                            >
                                <FaTrash className="text-xs" /> ลบ
                            </button>
                        </div>
                    ) : (
                        service.isBooked ? (
                            <button className="btn btn-disabled w-full bg-gray-200 text-gray-400 font-bold rounded-xl">
                                🚫 ไม่ว่าง (จองแล้ว)
                            </button>
                        ) : (
                            <Link
                                to={`/book/${service._id}`}
                                className="btn w-full border-none bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                            >
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
