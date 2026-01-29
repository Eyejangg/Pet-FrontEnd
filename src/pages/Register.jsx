import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // Use router-dom
import AuthService from "../services/authentication.service";
import { UserContext } from "../context/AuthContext"; // Import UserContext
import Swal from "sweetalert2";

const Register = () => {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);

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
        e?.preventDefault(); // Handle form submission event

        if (!user.username || !user.password) {
            Swal.fire({
                title: "ข้อผิดพลาด",
                text: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
                icon: "error",
            });
        } else {
            const response = await AuthService.register(user.username, user.password);

            if (response?.status === 201) {
                Swal.fire({
                    title: "สำเร็จ",
                    text: response?.data?.message || "สมัครสมาชิกเรียบร้อย",
                    icon: "success",
                }).then(() => {
                    navigate("/login");
                });
            } else {
                Swal.fire({
                    title: "ข้อผิดพลาด",
                    text: response?.data?.message || "การสมัครสมาชิกไม่สำเร็จ",
                    icon: "error",
                });
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-base-200">
            <div className="card bg-base-100 w-96 shadow-sm">
                <div className="card-body space-y-2">
                    <h2 className="card-title text-center justify-center text-2xl font-bold mb-4">สมัครสมาชิก</h2>
                    <label className="input input-bordered flex items-center gap-2">
                        <span className="w-20">ชื่อผู้ใช้</span>
                        <input
                            type="text"
                            className="grow"
                            placeholder="username"
                            name="username"
                            onChange={handleChange}
                            value={user.username}
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <span className="w-20">รหัสผ่าน</span>
                        <input
                            type="password"
                            className="grow"
                            placeholder="*****"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                        />
                    </label>
                    <button className="btn btn-primary mt-4 w-full" onClick={handleSubmit}>
                        สมัครสมาชิก
                    </button>
                    <p className="text-center mt-4 text-sm">
                        มีบัญชีอยู่แล้ว? <Link to="/login" className="link link-primary">เข้าสู่ระบบ</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
