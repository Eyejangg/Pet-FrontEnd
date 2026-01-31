import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../services/useAuth';
import PostService from '../services/post.service';
import { useNavigate } from 'react-router-dom';
import { PenLine, DollarSign, MapPin, Image, Plus, FileText, Check } from 'lucide-react';

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
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const availableServices = ['Pet Boarding', 'Pet Sitting', 'Dog Walking', 'Grooming', 'Training'];
    const serviceLabels = {
        'Pet Boarding': 'รับฝากเลี้ยง',
        'Pet Sitting': 'พี่เลี้ยงสัตว์',
        'Dog Walking': 'พาสุนัขเดินเล่น',
        'Grooming': 'อาบน้ำตัดขน',
        'Training': 'ฝึกสุนัข'
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleServiceType = (type) => {
        const { serviceTypes } = formData;
        if (serviceTypes.includes(type)) {
            setFormData({ ...formData, serviceTypes: serviceTypes.filter(t => t !== type) });
        } else {
            setFormData({ ...formData, serviceTypes: [...serviceTypes, type] });
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

        if (!image) {
            Swal.fire('ข้อผิดพลาด', 'กรุณาอัปโหลดรูปภาพ', 'error');
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            data.set('title', formData.title);
            data.set('serviceTypes', JSON.stringify(formData.serviceTypes));
            data.set('price', formData.price);
            data.set('location', formData.location);
            data.set('description', formData.description);
            data.set('image', image);

            // Use PostService
            const response = await PostService.createPost(data);

            if (response.status === 201) {
                Swal.fire({
                    title: 'สำเร็จ',
                    text: 'สร้างประกาศบริการเรียบร้อยแล้ว!',
                    icon: 'success'
                }).then(() => {
                    setFormData({
                        title: '',
                        serviceTypes: [],
                        price: '',
                        location: '',
                        description: ''
                    });
                    setImage(null);
                    setPreviewUrl('');
                    navigate('/');
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'ข้อผิดพลาด',
                text: error?.response?.data?.message || 'เกิดข้อผิดพลาดบางอย่าง',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white py-12 px-4 font-sans">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="bg-purple-50 p-8 text-center border-b border-purple-100">
                    <div className="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-bold tracking-wide mb-2">
                        NEW SERVICE
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">ลงประกาศบริการของคุณ</h2>
                    <p className="text-gray-500">เข้าร่วมเป็นส่วนหนึ่งกับเรา และเริ่มสร้างรายได้จากสิ่งที่คุณรัก</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Title */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700">ชื่อบริการ (หัวข้อ)</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <PenLine className="w-5 h-5" />
                                </span>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="เช่น รับฝากเลี้ยงน้องแมว คอนโดหรู..."
                                    className="input input-bordered w-full pl-10 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700">รายละเอียดบริการ</span>
                            </label>
                            <div className="relative">
                                <span className="absolute top-3 left-3 text-gray-400">
                                    <FileText className="w-5 h-5" />
                                </span>
                                <textarea
                                    name="description"
                                    className="textarea textarea-bordered h-32 w-full pl-10 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl text-base"
                                    placeholder="อธิบายรายละเอียดบริการของคุณ..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-bold text-gray-700">ราคา (บาท/วัน)</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                        <DollarSign className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="500"
                                        className="input input-bordered w-full pl-10 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-bold text-gray-700">สถานที่ / พื้นที่ให้บริการ</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                        <MapPin className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="เช่น กรุงเทพฯ, อารีย์"
                                        className="input input-bordered w-full pl-10 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Service Types (Pills) */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700">หมวดหมู่ (เลือกได้มากกว่า 1)</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {availableServices.map((service) => {
                                    const isSelected = formData.serviceTypes.includes(service);
                                    return (
                                        <button
                                            key={service}
                                            type="button"
                                            onClick={() => toggleServiceType(service)}
                                            className={`btn btn-sm h-auto py-2 rounded-lg capitalize border transition-all ${isSelected
                                                ? 'bg-rose-400 hover:bg-rose-500 text-white border-rose-400 shadow-md'
                                                : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
                                                }`}
                                        >
                                            {isSelected && <Check className="mr-1 w-3 h-3" />}
                                            {serviceLabels[service]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Image Upload & Preview */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700">รูปภาพปก</span>
                            </label>

                            {/* File Input */}
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="file"
                                    className="file-input file-input-bordered file-input-ghost w-full rounded-xl text-gray-500"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>

                            {/* Preview Box */}
                            <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
                                {previewUrl ? (
                                    <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-sm">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                        <Image className="w-10 h-10 mb-2" />
                                        <span className="text-sm">ตัวอย่างรูปภาพจะแสดงที่นี่</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="btn btn-ghost text-gray-500 hover:bg-gray-100 rounded-xl flex-1"
                            >
                                ยกเลิก
                            </button>
                            <button type="submit" className={`btn border-none bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-xl flex-[2] shadow-lg ${loading ? 'loading' : ''}`}>
                                {loading ? 'กำลังตกลง...' : (
                                    <>
                                        <Plus className="mr-2 w-5 h-5" /> สร้างประกาศ
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateService;
