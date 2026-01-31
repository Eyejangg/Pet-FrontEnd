import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../services/useAuth';
import PostService from '../services/post.service';
import { useNavigate, useParams } from 'react-router-dom';
import { PenLine, DollarSign, MapPin, Image, CloudUpload, FileText, Check } from 'lucide-react';

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

    const availableServices = ['Pet Boarding', 'Pet Sitting', 'Dog Walking', 'Grooming', 'Training', 'Veterinary'];
    const serviceLabels = {
        'Pet Boarding': 'รับฝากเลี้ยง',
        'Pet Sitting': 'พี่เลี้ยงสัตว์',
        'Dog Walking': 'พาสุนัขเดินเล่น',
        'Grooming': 'อาบน้ำตัดขน',
        'Training': 'ฝึกสุนัข',
        'Veterinary': 'พยาบาลสัตว์'
    };

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await PostService.getById(id);
                if (response.status === 200) {
                    const data = response.data;
                    const authorId = data?.providerId?._id || data?.providerId;

                    if (user?.id !== authorId) {
                        Swal.fire({
                            title: "ไม่ได้รับอนุญาต",
                            text: "คุณสามารถแก้ไขได้เฉพาะบริการที่สร้างด้วยตัวเองเท่านั้น",
                            icon: "error",
                        }).then(() => {
                            navigate("/");
                        });
                        return;
                    }

                    setFormData({
                        title: data.title,
                        serviceTypes: data.serviceTypes || [data.category] || [],
                        price: data.price,
                        location: data.location,
                        description: data.description
                    });
                    setPreviewUrl(data.image);
                }
            } catch (error) {
                Swal.fire({
                    title: "ข้อผิดพลาด",
                    text: error?.response?.data?.message || error.message,
                    icon: "error",
                }).then(() => {
                    navigate("/");
                });
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id, navigate, user]);

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

        setSubmitting(true);
        const data = new FormData();
        data.set('title', formData.title);
        data.set('serviceTypes', JSON.stringify(formData.serviceTypes));
        data.set('price', formData.price);
        data.set('location', formData.location);
        data.set('description', formData.description);
        if (image) {
            data.set('image', image);
        }

        try {
            const response = await PostService.updatePost(id, data);

            if (response.status === 200) {
                Swal.fire({
                    title: 'สำเร็จ',
                    text: 'แก้ไขข้อมูลเรียบร้อยแล้ว!',
                    icon: 'success'
                }).then(() => {
                    navigate('/');
                });
            }
        } catch (error) {
            console.error('Update Error:', error);
            Swal.fire({
                title: 'ข้อผิดพลาด',
                text: error?.response?.data?.message || 'เกิดข้อผิดพลาดในการแก้ไข',
                icon: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="min-h-screen bg-rose-50 py-12 px-4 font-sans flex items-center justify-center">
            <div className="card w-full max-w-2xl bg-white shadow-xl rounded-3xl overflow-hidden border border-rose-100">

                {/* Header */}
                <div className="text-center pt-8 pb-4 bg-white">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Your Pet Service</h2>
                    <p className="text-gray-500 text-sm mt-1">Update your service details for loving pet owners.</p>
                </div>

                <div className="card-body p-8 pt-2">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Title */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700">Service Title</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <FileText className="w-5 h-5" />
                                </span>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Luxury Cat Hotel"
                                    className="input input-bordered w-full pl-10 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl bg-white"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700">Description</span>
                            </label>
                            <textarea
                                name="description"
                                className="textarea textarea-bordered h-32 w-full p-4 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl text-base bg-white"
                                placeholder="Describe your service..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Price */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-bold text-gray-700">Price (THB/Day)</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                        <DollarSign className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="500"
                                        className="input input-bordered w-full pl-10 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl bg-white"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Image URL / Input */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-bold text-gray-700">Image</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                        <Image className="w-5 h-5" />
                                    </span>
                                    {/* Using file input but styled to look consistent */}
                                    <input
                                        type="file"
                                        className="file-input file-input-bordered w-full pl-10 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl bg-white text-gray-500"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700">Location</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <MapPin className="w-5 h-5" />
                                </span>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="e.g. Bangkok, Ari"
                                    className="input input-bordered w-full pl-10 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl bg-white"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Service Types (Pills) */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700">Category</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {availableServices.map((service) => {
                                    const isSelected = formData.serviceTypes.includes(service);
                                    return (
                                        <button
                                            key={service}
                                            type="button"
                                            onClick={() => toggleServiceType(service)}
                                            className={`btn btn-sm h-auto py-2 rounded-xl capitalize border transition-all shadow-sm ${isSelected
                                                ? 'bg-rose-400 hover:bg-rose-500 text-white border-rose-400'
                                                : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200 hover:border-rose-300'
                                                }`}
                                        >
                                            {isSelected && <Check className="mr-1 w-3 h-3" />}
                                            {serviceLabels[service] || service}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Preview Box */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700">Preview</span>
                            </label>
                            <div className="w-full h-48 bg-gray-50 rounded-2xl border border-dashed border-gray-300 overflow-hidden flex items-center justify-center">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-300 flex flex-col items-center">
                                        <Image className="w-8 h-8 mb-2" />
                                        <span className="text-sm">No image selected</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <button
                            type="submit"
                            className={`btn btn-block border-none bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-2xl shadow-lg text-lg h-12 mt-4 ${submitting ? 'loading' : ''}`}
                        >
                            <CloudUpload className="mr-2 w-5 h-5" /> Update Service
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditService;
