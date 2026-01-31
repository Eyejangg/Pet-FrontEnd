import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Cat, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-700 bg-gray-50">
            <Navbar />
            
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Premium Footer */}
            <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        
                        {/* Brand Column */}
                        <div className="md:col-span-1 space-y-4">
                            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-pink-500 hover:opacity-80 transition-opacity">
                                <Cat className="w-8 h-8" /> PetHub
                            </Link>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                แพลตฟอร์มที่เชื่อมต่อผู้ให้บริการและผู้ใช้บริการ ให้บริการด้วยความมั่นใจ ปลอดภัย หายห่วง กับ เพื่อนๆ พี่ๆน้องๆทุกคน
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">เมนูลัด</h3>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><Link to="/" className="hover:text-pink-500 transition-colors">หน้าแรก</Link></li>
                                <li><Link to="/?search=" className="hover:text-pink-500 transition-colors">ค้นหาบริการ</Link></li>
                                <li><Link to="/register" className="hover:text-pink-500 transition-colors">สมัครสมาชิก</Link></li>
                                <li><Link to="/login" className="hover:text-pink-500 transition-colors">เข้าสู่ระบบ</Link></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">บริการยอดนิยม</h3>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><span className="hover:text-pink-500 cursor-pointer">ฝากเลี้ยงน้อง</span></li>
                                <li><span className="hover:text-pink-500 cursor-pointer">พี่เลี้ยงสัตว์</span></li>
                                <li><span className="hover:text-pink-500 cursor-pointer">พาสุนัขเดินเล่น</span></li>
                                <li><span className="hover:text-pink-500 cursor-pointer">อาบน้ำตัดขน</span></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">ติดต่อเรา</h3>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-pink-400" />
                                    <span>กรุงเทพมหานคร, ประเทศไทย</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-pink-400" />
                                    <span>ptwptw1550@gmail.com</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-pink-400" />
                                    <span>061-108-xxxx</span>
                                </li>
                            </ul>
                            
                            {/* Social Icons */}
                            <div className="flex gap-4 mt-6">
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-pink-50 hover:text-pink-500 transition-all">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-pink-50 hover:text-pink-500 transition-all">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-pink-50 hover:text-pink-500 transition-all">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                        <p>© 2024 PetHub. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-pink-500">Privacy Policy</a>
                            <a href="#" className="hover:text-pink-500">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
