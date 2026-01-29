import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl text-primary font-bold">Meaw Meal</Link>
            </div>
            <div className="flex-none gap-2">
                {!user ? (
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-ghost btn-sm">เข้าสู่ระบบ</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">สมัครสมาชิก</Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        {/* "Create Service" is now available for everyone */}
                        <Link to="/create-service" className="btn btn-sm btn-outline btn-primary hidden sm:flex">
                            + สร้างโพสต์
                        </Link>

                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-10">
                                    <span className="text-lg">{user.username.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                <li className="sm:hidden"><Link to="/create-service">สร้างโพสต์</Link></li>
                                <li><Link to="/manage-bookings" className="justify-between">จัดการคำขอ <span className="badge badge-sm badge-warning">ใหม่</span></Link></li>
                                <li><Link to="/my-history">ประวัติการจอง</Link></li>
                                <li><a onClick={handleLogout} className="text-error">ออกจากระบบ</a></li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
