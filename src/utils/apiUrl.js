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
    GET_BRAND: `${BRAND_API_BASE}/:id`,
    UPDATE_BRAND : `${BRAND_API_BASE}/update/:id`,
    DELETE_BRAND : `${BRAND_API_BASE}/delete/:id`,
};


export const PRODUCT_API_BASE = `${API_BASE}/product`;

export const PRODUCT_API = {

    GET_ALL_PRODUCTS: `${PRODUCT_API_BASE}/all`,
    ADD_PRODUCT: `${PRODUCT_API_BASE}/add`,
    GET_PRODUCT: `${PRODUCT_API_BASE}/:id`,
    UPDATE_PRODUCT : `${PRODUCT_API_BASE}/update/:id`,
    DELETE_PRODUCT : `${PRODUCT_API_BASE}/delete/:id`, 

};

export const REVIEW_API_BASE = `${API_BASE}/review`;

export const REVIEW_API = {

    GET_ALL_REVIEWS: `${REVIEW_API_BASE}/all`,
    ADD_REVIEW: `${REVIEW_API_BASE}/add`,
    GET_REVIEW: `${REVIEW_API_BASE}/:id`,
    UPDATE_REVIEW : `${REVIEW_API_BASE}/update/:id`,
    DELETE_REVIEW : `${REVIEW_API_BASE}/delete/:id`, 
    STATUS_REVIEW : `${REVIEW_API_BASE}/:id/status`, 

};