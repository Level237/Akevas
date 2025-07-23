
export const shopCategoriesIsEmpty = (category: any[]): Promise<boolean> => {
    return new Promise((resolve) => {
        resolve(category.length === 0);
    });
}