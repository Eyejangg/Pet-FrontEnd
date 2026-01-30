import { useState, useEffect } from 'react';

import { useAuth } from '../services/useAuth';
import BookingService from '../services/booking.service';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaCalendarAlt, FaPaw, FaHistory, FaTrashAlt, FaSearch } from 'react-icons/fa';

import { th } from 'date-fns/locale';

const MyHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;
            try {
                const { data } = await BookingService.getBookingsByUser();
                setBookings(data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const handleCancel = async (id) => {
        const result = await Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "คุณต้องการยกเลิกการจองนี้ใช่ไหม?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ec4899',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: 'ใช่, ยกเลิกเลย',
            cancelButtonText: 'ไม่, เก็บไว้'
        });

        if (result.isConfirmed) {
            try {
                await BookingService.cancelBooking(id);

                Swal.fire('ยกเลิกสำเร็จ!', 'การจองของคุณถูกยกเลิกแล้ว', 'success');
                // Refresh list
                const { data } = await BookingService.getBookingsByUser();
                setBookings(data);
            } catch (error) {
                console.error('Cancel Error:', error);
                const message = error.response?.data?.message || 'การยกเลิกขัดข้อง';
                Swal.fire('ข้อผิดพลาด', message, 'error');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'Completed': return 'bg-green-100 text-green-600 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-600 border-red-200';
            default: return 'bg-yellow-100 text-yellow-600 border-yellow-200';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Pending': return 'รอดำเนินการ';
            case 'Confirmed': return 'ยืนยันแล้ว';
            case 'Completed': return 'เสร็จสิ้น';
            case 'Cancelled': return 'ยกเลิกแล้ว';
            case 'Rejected': return 'ปฏิเสธ';
            default: return status;
        }
    };

    const filteredBookings = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white py-12 px-4 font-sans">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden p-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-6">
                    <div>
                        <div className="inline-block p-2 bg-purple-100 rounded-lg text-purple-600 text-xl mb-2">
                            <FaHistory />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-800">ประวัติการจอง</h2>
                        <p className="text-gray-500">ติดตามสถานะการจองบริการของคุณ</p>
                    </div>
                    {/* Status Filter */}
                    <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl flex-wrap justify-center">
                        {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === status
                                    ? 'bg-white text-pink-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {status === 'All' ? 'ทั้งหมด' : getStatusText(status)}
                            </button>
                        ))}
                    </div>
                </div>

                {!bookings.length ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <FaCalendarAlt className="mx-auto text-6xl text-gray-300 mb-4" />
                        <p className="text-xl font-bold text-gray-400">ยังไม่มีประวัติการจอง</p>
                        <Link to="/" className="btn btn-primary bg-pink-500 border-none mt-6 rounded-xl shadow-lg hover:bg-pink-600">
                            เริ่มจองบริการครั้งแรก
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            {/* Head */}
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-100 uppercase text-xs tracking-wider">
                                    <th className="font-semibold py-4">บริการ</th>
                                    <th className="font-semibold py-4">สัตว์เลี้ยง</th>
                                    <th className="font-semibold py-4">วันที่</th>
                                    <th className="font-semibold py-4 text-center">สถานะ</th>
                                    <th className="font-semibold py-4 text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-purple-50 transition-colors border-b border-gray-50 last:border-none">
                                        {/* Service Info */}
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="mask mask-squircle w-12 h-12 bg-gray-100 shadow-sm">
                                                    <img
                                                        src={booking.serviceId?.image || 'https://placehold.co/150x150?text=Delete'}
                                                        alt="Service"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">{booking.serviceId?.title || 'บริการไม่พร้อมใช้งาน'}</div>
                                                    <div className="text-xs text-gray-400">ID: {booking._id.slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Pet Info */}
                                        <td className="font-medium text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FaPaw className="text-gray-300" />
                                                {booking.petName}
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="font-medium text-gray-600">
                                            {format(new Date(booking.bookingDate), 'dd MMM yyyy', { locale: th })}
                                        </td>

                                        {/* Status */}
                                        <td className="text-center">
                                            <div className={`badge badge-lg border ${getStatusBadge(booking.status)} py-3 px-4 font-bold rounded-lg`}>
                                                {getStatusText(booking.status)}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="text-right">
                                            {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                                                <button
                                                    onClick={() => handleCancel(booking._id)}
                                                    className="btn btn-sm btn-ghost text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg group"
                                                >
                                                    <FaTrashAlt className="group-hover:scale-110 transition-transform" />
                                                    <span className="hidden sm:inline">ยกเลิก</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyHistory;
