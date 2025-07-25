import { Image } from "@/types/seller";

export const shopImagesIsEmpty = (images: Image[]): Promise<boolean> => {
    return new Promise((resolve) => {
        resolve(images?.length === 0);
    });
}