

interface CompressionOptions {
    maxWidth?: number;
    maxHeight?:number;
    quality?:number;
    maxSizeMB?: number;
}

export const compressImage=(
    file:File,
    options:CompressionOptions= {}
) : Promise<File> => {

    const {
        maxWidth=1920,
        maxHeight=1080,
        quality=0.8,
        maxSizeMB=2
    }=options;

    return new Promise((resolve,reject)=>{
        const canvas=document.createElement('canvas');
        const ctx=canvas.getContext('2d');
        const img=new Image();

        img.onload=()=>{

            let {width,height} = img;
            if(width>maxWidth || height >maxHeight){
                const ratio=Math.min(maxWidth / width, maxHeight / height);
                width *=ratio;
                height *=ratio;
            }

            canvas.width=width;
            canvas.height=height;

            ctx?.drawImage(img,0,0,width,height);

            canvas.toBlob(
                (blob)=>{
                    if(!blob){
                        reject(new Error('Echec de la compression'))
                        return;
                    }

                    const sizeMB=blob.size / (1024 * 1024);

                    if(sizeMB > maxSizeMB){

                        canvas.toBlob(
                            (finalBlob)=> {
                                if(!finalBlob){
                                    reject(new Error('Echec de la recompression'))
                                    return;
                                }
                               resolve(new File([finalBlob],file.name,{type:'image/jpeg'}))

                            },
                            'image/jpeg',
                            Math.max(0.1,quality - 0.2)
                        );
                    }else{
                        resolve(new File([blob],file.name,{type:"image/jpeg"}))
                    }
                },
                'image/jpeg',
                quality
            )
        };

        img.onerror=()=>reject(new Error('Impossible de charger l\'image'));
        img.src=URL.createObjectURL(file);
    })
}

export const compressMultipleImages=async(
    files:FileList,
    options?:CompressionOptions
): Promise<File[]> => {
    const promises = Array.from(files).map(file=>compressImage(file,options));
    return Promise.all(promises);
}