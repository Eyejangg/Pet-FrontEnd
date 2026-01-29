import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const MyHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5000/api/bookings/my-bookings', config);
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
            title: 'แน่ใจหรือไม่?',
            text: "ต้องการยกเลิกการจองนี้ใช่ไหม",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'ยืนยันยกเลิก',
            cancelButtonText: 'ปิด'
        });

        if (result.isConfirmed) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                // Use Dedicated Cancel Endpoint
                await axios.put(`http://localhost:5000/api/bookings/${id}/cancel`, {}, config);

                Swal.fire('ยกเลิกสำเร็จ', 'การจองถูกยกเลิกแล้ว', 'success');
                // Refresh list
                const { data } = await axios.get('http://localhost:5000/api/bookings/my-bookings', config);
                setBookings(data);
            } catch (error) {
                console.error('Cancel Error:', error);
                const message = error.response?.data?.message || 'ไม่สามารถยกเลิกได้';
                const details = JSON.stringify(error.response?.data || {}, null, 2);
                Swal.fire('ข้อผิดพลาด', `${message}\n\n${details}`, 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-8 text-primary border-b pb-4">ประวัติการจองของฉัน</h2>

            {!bookings.length ? (
                <div className="text-center py-20 bg-base-200 rounded-xl">
                    <p className="text-2xl font-bold text-gray-400">ไม่พบประวัติการจอง</p>
                    <Link to="/" className="btn btn-primary mt-4">ไปจองบริการ</Link>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-xl rounded-lg">
                    <table className="table bg-base-100 w-full text-base">
                        {/* Table Head */}
                        <thead className="bg-primary text-primary-content text-lg">
                            <tr>
                                <th>วันที่</th>
                                <th>รูปบริการ</th>
                                <th>ชื่อบริการ</th>
                                <th>ชื่อสัตว์เลี้ยง</th>
                                <th>สถานะ</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="hover">
                                    {/* Date */}
                                    <td className="font-semibold">
                                        {format(new Date(booking.bookingDate), 'dd MMM yyyy')}
                                    </td>

                                    {/* Service Image */}
                                    <td>
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-16 h-16 bg-base-200">
                                                <img
                                                    src={booking.serviceId?.image || 'https://placehold.co/150x150?text=Deleted'}
                                                    alt="Service"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Service Name */}
                                    <td className="font-bold text-gray-700">
                                        {booking.serviceId?.title || 'บริการถูกลบไปแล้ว'}
                                    </td>

                                    {/* Pet Name */}
                                    <td className="text-info font-bold">
                                        {booking.petName}
                                    </td>

                                    {/* Status */}
                                    <td>
                                        <div className={`badge badge-lg ${booking.status === 'Confirmed' ? 'badge-info text-white' :
                                            booking.status === 'Completed' ? 'badge-success text-white' :
                                                booking.status === 'Pending' ? 'badge-warning' :
                                                    'badge-error text-white'
                                            }`}>
                                            {booking.status}
                                        </div>
                                    </td>

                                    {/* Actions (Customer Cancel) */}
                                    <td>
                                        {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                className="btn btn-sm btn-outline btn-error"
                                            >
                                                ยกเลิก
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
    );
};

export default MyHistory;
