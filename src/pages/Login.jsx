import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        if (result.success) {
            Swal.fire('สำเร็จ', 'เข้าสู่ระบบเรียบร้อย', 'success');
            navigate('/');
        } else {
            Swal.fire('ข้อผิดพลาด', result.message, 'error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-base-200">
            <div className="card w-full max-w-sm shadow-2xl bg-base-100">
                <div className="card-body">
                    <h2 className="card-title text-center text-2xl font-bold mb-4">เข้าสู่ระบบ</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label"><span className="label-text">ชื่อผู้ใช้ (Username)</span></label>
                            <input
                                type="text"
                                placeholder="กรอกชื่อผู้ใช้"
                                className="input input-bordered"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control mt-4">
                            <label className="label"><span className="label-text">รหัสผ่าน (Password)</span></label>
                            <input
                                type="password"
                                placeholder="กรอกรหัสผ่าน"
                                className="input input-bordered"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">เข้าสู่ระบบ</button>
                        </div>
                    </form>
                    <p className="text-center mt-4 text-sm">
                        ยังไม่มีบัญชี? <Link to="/register" className="link link-primary">สมัครสมาชิก</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
