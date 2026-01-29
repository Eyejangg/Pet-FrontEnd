import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../services/useAuth';
import { FaPaw, FaWeight, FaCalendarAlt, FaStickyNote, FaCheckCircle, FaDog, FaCat, FaQuestionCircle } from 'react-icons/fa';

const BookingForm = () => {
    const { id: serviceId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [service, setService] = useState(null);

    const [formData, setFormData] = useState({
        petName: '',
        petType: 'Dog',
        petWeight: '',
        bookingDate: '',
        specialNotes: ''
    });
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Service Details for Context
    useEffect(() => {
        const fetchService = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/services/${serviceId}`);
                setService(data);
            } catch (error) {
                console.error("Error fetching service:", error);
            }
        };
        fetchService();
    }, [serviceId]);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/bookings/service/${serviceId}/availability`);
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

        setLoading(true);
        try {
            const config = {
                headers: {
                    'x-access-token': user.token || user.accessToken,
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
                confirmButtonText: 'ไปที่ประวัติการจอง',
                confirmButtonColor: '#ec4899', // Pink-500
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white py-12 px-4 font-sans">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column: Service Summary */}
                <div className="md:col-span-1">
                    {service && (
                        <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24 border border-purple-50">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">สรุปการจอง</h3>
                            <div className="rounded-xl overflow-hidden aspect-video mb-4 shadow-sm">
                                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                            </div>
                            <h4 className="font-bold text-gray-700 text-lg mb-1">{service.title}</h4>
                            <p className="text-sm text-gray-500 mb-2">{service.providerId?.username}</p>
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl mt-4">
                                <span className="text-gray-600 font-medium">ราคา</span>
                                <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                                    ฿{service.price}
                                    <span className="text-xs text-gray-400 font-normal"> /วัน</span>
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Booking Form */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">
                        <div className="text-center mb-8">
                            <div className="inline-block p-3 bg-pink-100 rounded-full text-pink-500 text-2xl mb-3">
                                <FaCalendarAlt />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-800">กรอกข้อมูลการจอง</h2>
                            <p className="text-gray-500">ใส่รายละเอียดเกี่ยวกับสัตว์เลี้ยงของคุณ</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Pet Name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-gray-700">ชื่อสัตว์เลี้ยง</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                        <FaPaw />
                                    </span>
                                    <input
                                        type="text"
                                        name="petName"
                                        placeholder="เช่น เจ้าโบ้, ถุงทอง"
                                        className="input input-bordered w-full pl-10 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 rounded-xl"
                                        value={formData.petName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Pet Type */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-gray-700">ประเภท</span>
                                    </label>
                                    <div className="join w-full bg-base-100 rounded-xl border p-1">
                                        <button
                                            type="button"
                                            className={`join-item btn btn-sm flex-1 ${formData.petType === 'Dog' ? 'btn-primary bg-pink-500 border-pink-500 text-white shadow-md' : 'btn-ghost text-gray-500'}`}
                                            onClick={() => setFormData({ ...formData, petType: 'Dog' })}
                                        >
                                            <FaDog className="mr-1" /> สุนัข
                                        </button>
                                        <button
                                            type="button"
                                            className={`join-item btn btn-sm flex-1 ${formData.petType === 'Cat' ? 'btn-primary bg-pink-500 border-pink-500 text-white shadow-md' : 'btn-ghost text-gray-500'}`}
                                            onClick={() => setFormData({ ...formData, petType: 'Cat' })}
                                        >
                                            <FaCat className="mr-1" /> แมว
                                        </button>
                                        <button
                                            type="button"
                                            className={`join-item btn btn-sm flex-1 ${formData.petType === 'Other' ? 'btn-primary bg-pink-500 border-pink-500 text-white shadow-md' : 'btn-ghost text-gray-500'}`}
                                            onClick={() => setFormData({ ...formData, petType: 'Other' })}
                                        >
                                            <FaQuestionCircle className="mr-1" /> อื่นๆ
                                        </button>
                                    </div>
                                </div>

                                {/* Pet Weight */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-gray-700">น้ำหนัก (kg)</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                            <FaWeight />
                                        </span>
                                        <input
                                            type="number"
                                            name="petWeight"
                                            placeholder="0.0"
                                            className="input input-bordered w-full pl-10 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 rounded-xl"
                                            value={formData.petWeight}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.1"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-gray-700">วันที่ต้องการจอง</span>
                                </label>
                                <input
                                    type="date"
                                    name="bookingDate"
                                    className="input input-bordered w-full focus:border-pink-400 focus:ring-1 focus:ring-pink-400 rounded-xl"
                                    value={formData.bookingDate}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        if (unavailableDates.includes(selected)) {
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'วันที่นี้ไม่ว่าง',
                                                text: 'ขออภัย วันที่นี้มีการจองเต็มแล้ว',
                                                confirmButtonColor: '#ec4899'
                                            });
                                            setFormData({ ...formData, bookingDate: '' });
                                        } else {
                                            setFormData({ ...formData, bookingDate: selected });
                                        }
                                    }}
                                    required
                                />
                            </div>

                            {/* Special Notes */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-gray-700">หมายเหตุเพิ่มเติม (ถ้ามี)</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute top-3 left-3 text-gray-400">
                                        <FaStickyNote />
                                    </span>
                                    <textarea
                                        name="specialNotes"
                                        className="textarea textarea-bordered h-24 w-full pl-10 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 rounded-xl text-base"
                                        placeholder="เช่น แพ้อาหาร, นิสัยพิเศษ, โรคประจำตัว"
                                        value={formData.specialNotes}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn border-none bg-gradient-to-r from-pink-500 to-rose-500 w-full text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-rose-600 transition-all mt-4"
                            >
                                {loading ? <span className="loading loading-spinner"></span> : (
                                    <>
                                        ยืนยันการจอง <FaCheckCircle className="ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
