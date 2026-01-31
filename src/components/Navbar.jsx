import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
// import { FaSearch } from 'react-icons/fa'; // Removed unused
import { Cat, ChevronDown, User, Calendar, LogOut, PlusCircle, Search } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-sm px-4 sticky top-0 z-50 justify-between">
            <div className="flex-none">
                <Link to="/" className="btn btn-ghost text-2xl text-pink-500 font-bold flex items-center gap-2 hover:bg-transparent">
                    <Cat className="w-8 h-8" /> PetHub
                </Link>
            </div>

            <div className="flex-1 max-w-lg mx-4 hidden md:block">
                <form onSubmit={handleSearch} className="relative w-full">
                    <input
                        type="text"
                        placeholder="ค้นหาบริการของคุณ..."
                        className="input input-bordered w-full rounded-full bg-gray-100/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all shadow-sm px-6 text-gray-600 placeholder-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            </div>

            <div className="flex-none gap-2">
                {/* Mobile Search Toggle (Optional, simplified for now) */}
                <button className="btn btn-ghost btn-circle md:hidden text-gray-500 hover:text-pink-500" onClick={() => document.getElementById('search_modal').showModal()}>
                    <Search className="w-5 h-5" />
                </button>

                {!user ? (
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-ghost btn-sm text-gray-500 hover:text-pink-500">เข้าสู่ระบบ</Link>
                        <Link to="/register" className="btn btn-primary btn-sm bg-pink-500 border-none hover:bg-pink-600 text-white shadow-md rounded-full px-4">สมัครสมาชิก</Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/create-service" className="btn btn-sm btn-outline btn-primary border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white hover:border-pink-500 hidden sm:flex rounded-full">
                            + สร้างประกาศ
                        </Link>

                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-md rounded-full px-2 sm:px-4 flex items-center gap-2 hover:bg-pink-50 transition-all border border-transparent hover:border-pink-100 group">
                                <div className="flex items-center gap-2 text-left">
                                    <User className="w-5 h-5 text-gray-500 group-hover:text-pink-500 transition-colors" />
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-pink-600 hidden sm:inline">
                                        {user.username}
                                    </span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors hidden sm:block" />
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-white rounded-2xl w-60 border border-gray-100">
                                <li className="menu-title px-4 py-2 text-gray-400 text-xs font-semibold">เมนูส่วนตัว</li>
                                <li className="sm:hidden mb-1">
                                    <Link to="/create-service" className="active:bg-pink-500">
                                        <PlusCircle className="w-4 h-4" /> สร้างประกาศ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manage-bookings" className="py-3 px-4 hover:bg-purple-50 hover:text-purple-600 rounded-xl active:bg-purple-500">
                                        <Calendar className="w-4 h-4" />
                                        จัดการคำขอ
                                        <span className="badge badge-sm badge-warning ml-auto">ใหม่</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/my-history" className="py-3 px-4 hover:bg-pink-50 hover:text-pink-600 rounded-xl active:bg-pink-500">
                                        <User className="w-4 h-4" />
                                        ประวัติการจองของฉัน
                                    </Link>
                                </li>
                                <div className="divider my-1"></div>
                                <li>
                                    <a onClick={handleLogout} className="py-3 px-4 text-red-500 hover:bg-red-50 rounded-xl active:bg-red-500 active:text-white">
                                        <LogOut className="w-4 h-4" />
                                        ออกจากระบบ
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Search Modal */}
            <dialog id="search_modal" className="modal modal-top">
                <div className="modal-box m-0 rounded-none p-4">
                    <form onSubmit={(e) => { handleSearch(e); document.getElementById('search_modal').close(); }} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="ค้นหาบริการ..."
                            className="input input-bordered rounded-full w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="btn btn-primary rounded-full bg-pink-500 border-none text-white px-6">
                            ค้นหา
                        </button>
                    </form>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default Navbar;
