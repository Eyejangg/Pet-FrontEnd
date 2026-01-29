import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { FaCheck, FaTimes } from 'react-icons/fa';

const ManageBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
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
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status: newStatus }, config);

            Swal.fire({
                icon: 'success',
                title: `อัปเดตสถานะเป็น ${newStatus} แล้ว`,
                timer: 1500,
                showConfirmButton: false
            });

            fetchBookings(); // Refresh UI
        } catch (error) {
            Swal.fire('ข้อผิดพลาด', 'ไม่สามารถอัปเดตสถานะได้', 'error');
        }
    };

    if (loading) return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-primary mb-6">จัดการคำขอ (Income Bookings)</h1>
            <p className="mb-6 text-gray-500"> รายการคำขอจองบริการของคุณ</p>

            {bookings.length === 0 ? (
                <div className="alert alert-info">ยังไม่มีคำขอจองบริการของคุณในขณะนี้</div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-lg shadow-xl">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr className="bg-primary text-primary-content uppercase text-sm">
                                <th>บริการ</th>
                                <th>ลูกค้า</th>
                                <th>ข้อมูลสัตว์เลี้ยง</th>
                                <th>วันที่จอง</th>
                                <th>สถานะ</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12 bg-base-200">
                                                    <img src={booking.serviceId?.image} alt="Service" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{booking.serviceId?.title}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-semibold">{booking.userId?.username}</div>
                                    </td>
                                    <td>
                                        <div className="text-sm">
                                            <p className="font-bold">{booking.petName} <span className="badge badge-sm badge-ghost">{booking.petType}</span></p>
                                            <p>{booking.petWeight} kg</p>
                                            {booking.specialNotes && <p className="text-xs text-info italic">"{booking.specialNotes}"</p>}
                                        </div>
                                    </td>
                                    <td>
                                        {new Date(booking.bookingDate).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className={`badge ${booking.status === 'Confirmed' ? 'badge-info text-white' :
                                            booking.status === 'Completed' ? 'badge-success text-white' :
                                                booking.status === 'Pending' ? 'badge-warning' :
                                                    'badge-error text-white' // Cancelled/Rejected
                                            }`}>
                                            {booking.status}
                                        </div>
                                    </td>
                                    <td className="flex gap-2">
                                        {booking.status === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}
                                                    className="btn btn-sm btn-success text-white"
                                                    title="Approve"
                                                >
                                                    <FaCheck /> ยืนยัน
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(booking._id, 'Rejected')}
                                                    className="btn btn-sm btn-error text-white"
                                                    title="Reject"
                                                >
                                                    <FaTimes /> ปฏิเสธ
                                                </button>
                                            </>
                                        )}
                                        {booking.status === 'Confirmed' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(booking._id, 'Completed')}
                                                    className="btn btn-sm btn-primary btn-outline"
                                                >
                                                    เสร็จสิ้นงาน
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
                                                    className="btn btn-sm btn-ghost text-error"
                                                >
                                                    ยกเลิกจอง
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageBookings;
