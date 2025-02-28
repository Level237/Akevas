export const redirectToLogin = (options: {
    redirectUrl: string,
    productIds?: string[] | string | null,
    [key: string]: string | string[] | null | undefined
}) => {
    const { redirectUrl = null, productIds = null, ...params } = options;
    const currentUrl = window.location.href;

    // Construction de l'URL de redirection
    const loginUrl = new URL('/login', window.location.origin);

    if (redirectUrl) {
        loginUrl.searchParams.append('redirect', redirectUrl);
    } else {
        loginUrl.searchParams.append('redirect', currentUrl);
    }

    // Ajout des productIds sous forme de paramètres
    if (Array.isArray(productIds)) {
        productIds.forEach(id => {
            loginUrl.searchParams.append('productId', id);
        });
    } else if (productIds) {
        loginUrl.searchParams.append('productId', productIds);
    }

    // Ajout des autres paramètres supplémentaires
    Object.keys(params).forEach(key => {
        const value = params[key];
        if (value) {
            if (Array.isArray(value)) {
                value.forEach(v => loginUrl.searchParams.append(key, v));
            } else {
                loginUrl.searchParams.append(key, value);
            }
        }
    });

    // Redirection vers l'URL construite
    window.location.href = loginUrl.toString();
};