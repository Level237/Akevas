import Cookies from "universal-cookie";

export const logoutUser = () => {
    const cookies = new Cookies();
    cookies.remove('token-seller', { path: '/' });
    cookies.remove('refreshToken-seller', { path: '/' });
    window.location.href = '/login'
}