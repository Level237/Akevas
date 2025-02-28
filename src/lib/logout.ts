import Cookies from "universal-cookie";

export const logoutUser = () => {
    const cookies = new Cookies();
    cookies.remove('accessToken', { path: '/' });
    cookies.remove('refreshToken', { path: '/' });
    window.location.href = '/login'
}