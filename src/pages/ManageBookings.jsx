import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../services/useAuth';
import Swal from 'sweetalert2';
import { FaCheck, FaTimes, FaClipboardList, FaPaw, FaUser, FaClock, FaCheckCircle } from 'react-icons/fa';
import { format } from 'date-fns';

import { th } from 'date-fns/locale';

const ManageBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const fetchBookings = async () => {
        try {
            const config = {
                headers: { 'x-access-token': user.token || user.accessToken }
            };
            const { data } = await axios.get('http://localhost:5000/api/bookings/provider-bookings', config);
            setBookings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchBookings();
    }, [user]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const config = {
                headers: { 'x-access-token': user.token || user.accessToken }
            };
            await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status: newStatus }, config);

            Swal.fire({
                icon: 'success',
                title: 'อัปเดตสถานะสำเร็จ',
                text: `การจองถูกปรับเป็นสถานะ ${getStatusText(newStatus)}`,
                timer: 1500,
                showConfirmButton: false
            });

            fetchBookings(); // Refresh UI
        } catch (error) {
            Swal.fire('ข้อผิดพลาด', 'ไม่สามารถอัปเดตสถานะได้', 'error');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'Completed': return 'bg-green-100 text-green-600 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-600 border-red-200';
            case 'Cancelled': return 'bg-gray-100 text-gray-500 border-gray-200';
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

    const stats = {
        all: bookings.length,
        pending: bookings.filter(b => b.status === 'Pending').length,
        confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white py-12 px-4 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* Header Section with Stats */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">จัดการคำขอจอง</h1>
                    <p className="text-gray-500 mb-6">ภาพรวมคำขอรับบริการทั้งหมดจากลูกค้า</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Stat Cards */}
                        <div
                            onClick={() => setFilter('All')}
                            className={`cursor-pointer bg-white p-6 rounded-2xl shadow-md border transition-all hover:shadow-lg flex items-center gap-4 ${filter === 'All' ? 'border-purple-400 ring-1 ring-purple-400' : 'border-purple-50'}`}
                        >
                            <div className="p-4 bg-purple-100 text-purple-600 rounded-xl">
                                <FaClipboardList className="text-xl" />
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-bold uppercase">คำขอทั้งหมด</h3>
                                <p className="text-3xl font-extrabold text-gray-800">{stats.all}</p>
                            </div>
                        </div>

                        <div
                            onClick={() => setFilter('Pending')}
                            className={`cursor-pointer bg-white p-6 rounded-2xl shadow-md border transition-all hover:shadow-lg flex items-center gap-4 ${filter === 'Pending' ? 'border-yellow-400 ring-1 ring-yellow-400 t' : 'border-purple-50'}`}
                        >
                            <div className="p-4 bg-yellow-100 text-yellow-600 rounded-xl">
                                <FaClock className="text-xl" />
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-bold uppercase">รอดำเนินการ</h3>
                                <p className="text-3xl font-extrabold text-gray-800">{stats.pending}</p>
                            </div>
                        </div>

                        <div
                            onClick={() => setFilter('Confirmed')}
                            className={`cursor-pointer bg-white p-6 rounded-2xl shadow-md border transition-all hover:shadow-lg flex items-center gap-4 ${filter === 'Confirmed' ? 'border-blue-400 ring-1 ring-blue-400' : 'border-purple-50'}`}
                        >
                            <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
                                <FaCheckCircle className="text-xl" />
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-bold uppercase">งานที่กำลังมาถึง</h3>
                                <p className="text-3xl font-extrabold text-gray-800">{stats.confirmed}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Toolbar */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-2 items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-700">รายการละเอียด</h2>
                        <div className="flex gap-2">
                            {['All', 'Pending', 'Confirmed', 'Completed', 'Rejected', 'Cancelled'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`btn btn-xs sm:btn-sm rounded-lg capitalize border-none ${filter === status ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {status === 'All' ? 'ทั้งหมด' : getStatusText(status)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {!bookings.length ? (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">ยังไม่มีคำขอจองเข้ามา</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead className="bg-white border-b border-gray-100">
                                    <tr className="text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="py-4 pl-6">บริการ</th>
                                        <th className="py-4">ลูกค้า & สัตว์เลี้ยง</th>
                                        <th className="py-4">วันที่</th>
                                        <th className="py-4 text-center">สถานะ</th>
                                        <th className="py-4 pr-6 text-right">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-purple-50/30 transition-colors">
                                            {/* Service */}
                                            <td className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="mask mask-squircle w-12 h-12 bg-gray-200 shadow-sm">
                                                        <img src={booking.serviceId?.image} alt={booking.serviceId?.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="font-bold text-gray-700 text-sm">
                                                        {booking.serviceId?.title || 'Unknown Service'}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Customer & Pet */}
                                            <td className="py-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1 font-bold text-gray-700">
                                                        <FaUser className="text-xs text-gray-300" /> {booking.userId?.username}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                        <FaPaw className="text-pink-300 text-xs" /> {booking.petName}
                                                        <span className="text-xs bg-gray-100 px-1.5 rounded text-gray-500">{booking.petType}</span>
                                                    </div>
                                                    {booking.specialNotes && (
                                                        <div className="text-xs text-orange-400 mt-1 italic max-w-xs truncate" title={booking.specialNotes}>
                                                            Note: {booking.specialNotes}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="py-4 font-medium text-gray-600 text-sm">
                                                {format(new Date(booking.bookingDate), 'dd MMM yyyy', { locale: th })}
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 text-center">
                                                <div className={`badge badge-lg border font-bold ${getStatusBadge(booking.status)}`}>
                                                    {getStatusText(booking.status)}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="pr-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {booking.status === 'Pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}
                                                                className="btn btn-sm btn-outline btn-success shadow-none hover:shadow-md hover:!text-black"
                                                                title="รับงาน"
                                                            >
                                                                <FaCheck /> รับงาน
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking._id, 'Rejected')}
                                                                className="btn btn-sm btn-error btn-outline shadow-sm hover:bg-red-500 hover:text-white"
                                                                title="ปฏิเสธงาน"
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </>
                                                    )}
                                                    {booking.status === 'Confirmed' && (
                                                        <div className="dropdown dropdown-end">
                                                            <label tabIndex={0} className="btn btn-sm m-1 btn-ghost border-gray-200">จัดการ</label>
                                                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-gray-100">
                                                                <li>
                                                                    <a onClick={() => handleStatusUpdate(booking._id, 'Completed')} className="text-green-600 font-medium">
                                                                        ระบุว่าเสร็จสิ้นแล้ว
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a onClick={() => handleStatusUpdate(booking._id, 'Cancelled')} className="text-red-500">
                                                                        ยกเลิกการจอง
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {['Completed', 'Rejected', 'Cancelled'].includes(booking.status) && (
                                                        <span className="text-gray-300 text-sm italic">เสร็จสิ้น</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageBookings;
