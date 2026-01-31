import { useContext } from 'react';
import { UserContext } from '../context/AuthContext';

export const useAuth = () => {
    // ไปหา userContext 
    const context = useContext(UserContext);

    // userContext มีข้อมูลอะไรบ้าง
    // ตอนนี้ ใคร Login อยู่เหรอ
    // มี Token เก็บไว้ไหม
    // มีฟังก์ชัน Login/Logout ไหม
    return {
        ...context, // นำทุกอย่างมา Login Logout 
        user: context?.userInfo,
    };
};