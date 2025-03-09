
import Cookies from "universal-cookie";

export const logoutUser = () => {
    const cookies = new Cookies();

    cookies.remove('tokenDelivery', { path: '/' });
    cookies.remove('refreshTokenDelivery', { path: '/' });
    window.location.href = '/login'

}   