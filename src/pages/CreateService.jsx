import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateService = () => {
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
    const [loading, setLoading] = useState(false);

    const availableServices = ['Pet Boarding', 'Pet Sitting', 'Dog Walking', 'Grooming'];

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
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.serviceTypes.length === 0) {
            Swal.fire('ข้อผิดพลาด', 'กรุณาเลือกประเภทบริการอย่างน้อย 1 อย่าง', 'error');
            return;
        }

        if (!image) {
            Swal.fire('ข้อผิดพลาด', 'กรุณาอัปโหลดรูปภาพ', 'error');
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        // Send array as JSON string
        data.append('serviceTypes', JSON.stringify(formData.serviceTypes));
        data.append('price', formData.price);
        data.append('location', formData.location);
        data.append('description', formData.description);
        data.append('image', image);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.post('http://localhost:5000/api/services', data, config);

            Swal.fire('สำเร็จ', 'สร้างโพสต์บริการเรียบร้อยแล้ว!', 'success');
            navigate('/');
        } catch (error) {
            Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดบางอย่าง', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 py-10 px-4">
            <div className="max-w-2xl mx-auto bg-base-100 rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-primary">ลงทะเบียนเป็นผู้ดูแล (Host)</h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Title */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-bold">ชื่อหัวข้อบริการ</span></label>
                        <input type="text" name="title" placeholder="ตัวอย่าง: รับฝากเลี้ยงแมว บ้านอบอุ่น" className="input input-bordered" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Service Types (Checkboxes) */}
                        <div className="form-control">
                            <label className="label"><span className="label-text font-bold">ประเภทบริการ (เลือกได้หลายข้อ)</span></label>
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
                            <input type="number" name="price" placeholder="500" className="input input-bordered" value={formData.price} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Location - NEW */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-bold">สถานที่ (เขต/จังหวัด)</span></label>
                        <input type="text" name="location" placeholder="ตัวอย่าง: อารีย์, กรุงเทพฯ" className="input input-bordered" value={formData.location} onChange={handleChange} required />
                    </div>

                    {/* Description */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-bold">รายละเอียดเพิ่มเติม</span></label>
                        <textarea name="description" className="textarea textarea-bordered h-24" placeholder="แนะนำตัวคร่าวๆ และสถานที่ของคุณ..." value={formData.description} onChange={handleChange} required></textarea>
                    </div>

                    {/* Image */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-bold">รูปภาพปก</span></label>
                        <input type="file" className="file-input file-input-bordered file-input-primary" accept="image/*" onChange={handleFileChange} required />

                        {/* Preview */}
                        {image && (
                            <div className="mt-4 border rounded-xl overflow-hidden h-48 bg-base-200">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>

                    <button type="submit" className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}>
                        {loading ? 'กำลังสร้างโพสต์...' : 'ยืนยันการสร้างโพสต์'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateService;
