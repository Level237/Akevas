import Cookies from "universal-cookie";

export const logoutUser = () => {
    const cookies = new Cookies();
    cookies.remove('tokenSeller', { path: '/' });
    cookies.remove('refreshTokenSeller', { path: '/' });
    window.location.href = '/login'
}