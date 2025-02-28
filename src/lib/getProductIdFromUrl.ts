export const getProductIdsFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const productIdsString = params.get('productId'); // Récupérer la chaîne productId
    return productIdsString ? productIdsString.split(',') : []; // Convertir en tableau
};