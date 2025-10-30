const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const  API_BASE = `${BASE_URL}/api`;

const AUTH_API_BASE = `${API_BASE}/auth`;
export const USER_API_BASE = `${API_BASE}/users`;

export const API_URL = {

    LOGIN_USER: `${AUTH_API_BASE}/login`,
    REGISTER_USER: `${AUTH_API_BASE}/register`, 
    LOGOUT_USER: `${AUTH_API_BASE}/logout`, 

    SEND_RESET_LINK: `${AUTH_API_BASE}/send-reset-link`,

    SEND_OTP_ON_EMAIL:`${AUTH_API_BASE}/forgot-password`,
    VERIFY_OTP:`${AUTH_API_BASE}/verify-otp`,
    RESET_PASSWORD:`${AUTH_API_BASE}/reset-password`,

    SEND_VERIFICATION_EMAIL:`${AUTH_API_BASE}/send-verification-link`,
    VERIFY_EMAIL:`${AUTH_API_BASE}/verify-email`,

};

export const BRAND_API_BASE = `${API_BASE}/brand`;

export const BRAND_API = {

    GET_ALL_BRANDS: `${BRAND_API_BASE}/all`,
    ADD_BRAND: `${BRAND_API_BASE}/add`, 

};


export const PRODUCT_API_BASE = `${API_BASE}/product`;

export const PRODUCT_API = {

    GET_ALL_PRODUCTS: `${BRAND_API_BASE}/all`,
    ADD_PRODUCT: `${BRAND_API_BASE}/add`, 

};