import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

const BookingForm = () => {
    const { id: serviceId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        petName: '',
        petType: 'Dog',
        petWeight: '',
        bookingDate: '',
        specialNotes: ''
    });
    const [unavailableDates, setUnavailableDates] = useState([]);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/bookings/service/${serviceId}/availability`);
                // Convert string dates to format YYYY-MM-DD for easier comparison
                const dates = data.map(date => new Date(date).toISOString().split('T')[0]);
                setUnavailableDates(dates);
            } catch (error) {
                console.error("Error fetching availability:", error);
            }
        };
        fetchAvailability();
    }, [serviceId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            Swal.fire('กรุณาเข้าสู่ระบบ', 'คุณต้องเข้าสู่ระบบก่อนทำการจอง', 'warning');
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.post(
                'http://localhost:5000/api/bookings',
                {
                    serviceId,
                    ...formData,
                },
                config
            );

            Swal.fire({
                icon: 'success',
                title: 'จองสำเร็จ!',
                text: 'การจองของคุณถูกส่งไปยังผู้ดูแลแล้ว',
                confirmButtonText: 'ไปที่ประวัติการจอง'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/my-history');
                } else {
                    navigate('/');
                }
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'การจองล้มเหลว',
                text: error.response?.data?.message || 'โปรดลองอีกครั้งในภายหลัง'
            });
        }
    };

    return (
        <div className="min-h-screen bg-base-200 py-10 px-4">
            <div className="max-w-xl mx-auto bg-base-100 rounded-xl shadow-xl overflow-hidden">
                <div className="bg-primary p-6 text-primary-content text-center">
                    <h2 className="text-2xl font-bold">รายละเอียดการจอง</h2>
                    <p className="opacity-80">กรอกข้อมูลสัตว์เลี้ยงของคุณ</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">

                    {/* Who is this for? -> petName */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-base">ชื่อสัตว์เลี้ยง (Pet Name)</span>
                        </label>
                        <input
                            type="text"
                            name="petName"
                            placeholder="เช่น เจ้าบัดดี้"
                            className="input input-bordered w-full"
                            value={formData.petName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Type? -> petType */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base">ประเภท</span>
                            </label>
                            <select
                                name="petType"
                                className="select select-bordered"
                                value={formData.petType}
                                onChange={handleChange}
                            >
                                <option value="Dog">สุนัข (Dog)</option>
                                <option value="Cat">แมว (Cat)</option>
                                <option value="Other">อื่นๆ (Other)</option>
                            </select>
                        </div>

                        {/* Weight (kg)? -> petWeight */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base">น้ำหนัก (kg)</span>
                            </label>
                            <input
                                type="number"
                                name="petWeight"
                                placeholder="0.0"
                                className="input input-bordered"
                                value={formData.petWeight}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                required
                            />
                        </div>
                    </div>

                    {/* Date? -> bookingDate */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-base">วันที่จอง</span>
                        </label>
                        <input
                            type="date"
                            name="bookingDate"
                            className="input input-bordered w-full"
                            value={formData.bookingDate}
                            onChange={(e) => {
                                const selected = e.target.value;
                                if (unavailableDates.includes(selected)) {
                                    Swal.fire('วันที่ไม่ว่าง', 'วันดังกล่าวถูกจองเต็มแล้ว กรุณาเลือกวันอื่น', 'warning');
                                    setFormData({ ...formData, bookingDate: '' });
                                } else {
                                    setFormData({ ...formData, bookingDate: selected });
                                }
                            }}
                            required
                        />
                        {/* Optional: Visual Hint */}
                        {unavailableDates.length > 0 && (
                            <div className="mt-2 text-xs text-error">
                                วันที่ไม่ว่าง: {unavailableDates.map(d => new Date(d).toLocaleDateString()).join(', ')}
                            </div>
                        )}
                    </div>

                    {/* Special Notes */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">หมายเหตุเพิ่มเติม (ถ้ามี)</span>
                        </label>
                        <textarea
                            name="specialNotes"
                            className="textarea textarea-bordered h-20"
                            placeholder="เช่น ขี้กลัว, แพ้อาหาร..."
                            value={formData.specialNotes}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary w-full text-lg">
                            ยืนยันการจอง
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
