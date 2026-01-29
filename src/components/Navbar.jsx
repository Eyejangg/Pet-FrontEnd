import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import { FaSearch, FaCat } from 'react-icons/fa';

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
        <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50 justify-between">
            <div className="flex-none">
                <Link to="/" className="btn btn-ghost text-2xl text-pink-500 font-bold flex items-center gap-2 hover:bg-transparent">
                    <FaCat className="text-3xl" /> Meaw Meal
                </Link>
            </div>

            {/* Search Bar - Center */}
            <div className="flex-1 max-w-lg mx-4 hidden md:block">
                <form onSubmit={handleSearch} className="join w-full shadow-sm rounded-full border border-gray-200 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-200 transition-all">
                    <input
                        type="text"
                        placeholder="Search services..."
                        className="input input-ghost join-item w-full pl-6 focus:bg-transparent focus:outline-none text-gray-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="btn btn-ghost join-item rounded-r-full text-gray-400 hover:text-pink-500">
                        <FaSearch />
                    </button>
                </form>
            </div>

            <div className="flex-none gap-2">
                {/* Mobile Search Toggle (Optional, simplified for now) */}
                <button className="btn btn-ghost btn-circle md:hidden text-gray-500" onClick={() => document.getElementById('search_modal').showModal()}>
                    <FaSearch />
                </button>

                {!user ? (
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-ghost btn-sm">เข้าสู่ระบบ</Link>
                        <Link to="/register" className="btn btn-primary btn-sm bg-pink-500 border-none hover:bg-pink-600 text-white">สมัครสมาชิก</Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/create-service" className="btn btn-sm btn-outline btn-primary border-pink-500 text-pink-500 hover:bg-pink-500 hover:border-pink-500 hidden sm:flex">
                            + สร้างประกาศ
                        </Link>

                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder ring ring-pink-500 ring-offset-base-100 ring-offset-2">
                                <div className="bg-pink-500 text-white rounded-full w-10">
                                    <span className="text-lg">{user.username.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                <li className="sm:hidden"><Link to="/create-service">สร้างประกาศ</Link></li>
                                <li><Link to="/manage-bookings" className="justify-between">จัดการคำขอ <span className="badge badge-sm badge-warning">ใหม่</span></Link></li>
                                <li><Link to="/my-history">ประวัติการจอง</Link></li>
                                <li><a onClick={handleLogout} className="text-error">ออกจากระบบ</a></li>
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
                            placeholder="Search..."
                            className="input input-bordered w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="btn btn-primary bg-pink-500 border-none text-white">
                            <FaSearch />
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
