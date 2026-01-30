import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/authentication.service";
import Swal from "sweetalert2";
import { UserContext } from "../context/AuthContext";

import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

const Login = () => {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });
    const { logIn, userInfo } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            navigate("/");
        }
    }, [userInfo, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((user) => ({ ...user, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();

        if (!user.username || !user.password) {
            Swal.fire({
                title: "ข้อผิดพลาด",
                text: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
                icon: "error",
            });
        } else {
            const response = await AuthService.login(user.username, user.password);

            if (response?.status === 200) {
                Swal.fire({
                    title: "สำเร็จ",
                    text: response?.data?.message || "เข้าสู่ระบบเรียบร้อย",
                    icon: "success",
                }).then(() => {
                    logIn({
                        id: response.data.id,
                        username: response.data.username,
                        accessToken: response.data.accessToken,
                        token: response.data.accessToken, // Compatibility
                    });
                    navigate("/");
                });
            } else {
                Swal.fire({
                    title: "ข้อผิดพลาด",
                    text: "ไม่สามารถเข้าสู่ระบบได้ กรุณาตรวจสอบข้อมูล",
                    icon: "error",
                });
            }
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-rose-50 via-white to-rose-50 flex items-center justify-center p-4">
            <div className="card w-full max-w-md bg-white shadow-xl rounded-3xl overflow-hidden border border-rose-100">
                <div className="card-body p-8">
                    <div className="text-center mb-6">
                        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                            <FaUser className="text-3xl text-rose-500" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-800">ยินดีต้อนรับกลับมา!</h2>
                        <p className="text-gray-500 mt-2">เข้าสู่ระบบเพื่อใช้งาน PetHub</p>
                    </div>

                    <form className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700">ชื่อผู้ใช้</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <FaUser />
                                </span>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    className="input input-bordered w-full pl-10 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl bg-gray-50"
                                    value={user.username}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-gray-700">รหัสผ่าน</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <FaLock />
                                </span>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="input input-bordered w-full pl-10 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl bg-gray-50"
                                    value={user.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            className="btn w-full border-none bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold rounded-xl shadow-md mt-6 h-12 text-lg"
                            onClick={handleSubmit}
                        >
                            <FaSignInAlt className="mr-2" /> เข้าสู่ระบบ
                        </button>
                    </form>

                    <div className="divider text-gray-400 text-sm">หรือ</div>

                    <p className="text-center text-gray-600">
                        ยังไม่มีบัญชี?{' '}
                        <Link to="/register" className="text-rose-500 font-bold hover:underline">
                            สมัครสมาชิกฟรี
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
