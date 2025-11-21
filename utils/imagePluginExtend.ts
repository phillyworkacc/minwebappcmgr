import imageCompression from 'browser-image-compression';

export async function fileToBase64 (file: any): Promise<any> {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
   });
};

export async function compressImage (file: any) {
   const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
   };
   return await imageCompression(file, options);
};