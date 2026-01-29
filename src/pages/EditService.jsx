import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const EditService = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        serviceTypes: [],
        price: '',
        location: '',
        description: ''
    });
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const availableServices = ['Pet Boarding', 'Pet Sitting', 'Dog Walking', 'Grooming'];

    useEffect(() => {
        const fetchService = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/services/${id}`);
                setFormData({
                    title: data.title,
                    serviceTypes: data.serviceTypes || [data.category] || [], // Fallback for old data
                    price: data.price,
                    location: data.location,
                    description: data.description
                });
                setPreviewUrl(data.image);
                setLoading(false);
            } catch (error) {
                Swal.fire('Error', 'ไม่สามารถดึงข้อมูลได้', 'error');
                navigate('/');
            }
        };
        fetchService();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleServiceTypeChange = (e) => {
        const { value, checked } = e.target;
        const { serviceTypes } = formData;

        if (checked) {
            setFormData({ ...formData, serviceTypes: [...serviceTypes, value] });
        } else {
            setFormData({ ...formData, serviceTypes: serviceTypes.filter((t) => t !== value) });
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.serviceTypes.length === 0) {
            Swal.fire('ข้อผิดพลาด', 'กรุณาเลือกประเภทบริการอย่างน้อย 1 อย่าง', 'error');
            return;
        }

        setSubmitting(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('serviceTypes', JSON.stringify(formData.serviceTypes));
        data.append('price', formData.price);
        data.append('location', formData.location);
        data.append('description', formData.description);
        if (image) {
            data.append('image', image);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.put(`http://localhost:5000/api/services/${id}`, data, config);

            Swal.fire('สำเร็จ', 'แก้ไขข้อมูลเรียบร้อยแล้ว!', 'success');
            navigate('/');
        } catch (error) {
            console.error('Update Error:', error);
            Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการแก้ไข', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="min-h-screen bg-base-200 py-10 px-4">
            <div className="max-w-2xl mx-auto bg-base-100 rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-primary">แก้ไขข้อมูลบริการ</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-bold">ชื่อหัวข้อบริการ</span></label>
                        <input type="text" name="title" className="input input-bordered" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Service Types */}
                        <div className="form-control">
                            <label className="label"><span className="label-text font-bold">ประเภทบริการ</span></label>
                            <div className="flex flex-col gap-2 p-2 border rounded-lg bg-base-100">
                                {availableServices.map((service) => (
                                    <label key={service} className="cursor-pointer label justify-start gap-4 hover:bg-base-200 rounded-lg p-2 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary"
                                            value={service}
                                            checked={formData.serviceTypes.includes(service)}
                                            onChange={handleServiceTypeChange}
                                        />
                                        <span className="label-text text-base">{service}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="form-control">
                            <label className="label"><span className="label-text font-bold">ราคา (ต่อวัน/งาน)</span></label>
                            <input type="number" name="price" className="input input-bordered" value={formData.price} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-bold">สถานที่</span></label>
                        <input type="text" name="location" className="input input-bordered" value={formData.location} onChange={handleChange} required />
                    </div>

                    {/* Description */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-bold">รายละเอียดเพิ่มเติม</span></label>
                        <textarea name="description" className="textarea textarea-bordered h-24" value={formData.description} onChange={handleChange} required></textarea>
                    </div>

                    {/* Image */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-bold">รูปภาพปก (อัปโหลดใหม่เพื่อเปลี่ยน)</span></label>
                        <input type="file" className="file-input file-input-bordered file-input-primary" accept="image/*" onChange={handleFileChange} />

                        {/* Preview */}
                        {previewUrl && (
                            <div className="mt-4 border rounded-xl overflow-hidden h-48 bg-base-200 relative aspect-video">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 right-2 badge badge-info">รูปปัจจุบัน/ตัวอย่าง</div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" onClick={() => navigate('/')} className="btn btn-outline text-gray-500">ยกเลิก</button>
                        <button type="submit" className={`btn btn-primary ${submitting ? 'loading' : ''}`}>
                            {submitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditService;
