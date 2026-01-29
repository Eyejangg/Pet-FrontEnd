import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/authentication.service";
import Swal from "sweetalert2";
import { UserContext } from "../context/AuthContext";

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
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-base-200">
            <div className="card bg-base-100 w-96 shadow-sm">
                <div className="card-body space-y-2">
                    <h2 className="card-title text-center justify-center text-2xl font-bold mb-4">เข้าสู่ระบบ</h2>
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
                        เข้าสู่ระบบ
                    </button>
                    <p className="text-center mt-4 text-sm">
                        ยังไม่มีบัญชี? <Link to="/register" className="link link-primary">สมัครสมาชิก</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
