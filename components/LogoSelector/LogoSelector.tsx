'use client'
import { useState } from "react";
import { CustomUserIcon } from "../Icons/Icon";
import { X } from "lucide-react";
import { toast } from "sonner";
import { uploadImageToCloudinary } from "@/app/actions/extras";
import LoadingImageCf from "@/public/loading-image-cf.png";

type LogoSelectorProps = {
   defaultImage?: string;
   onChange: (image: string) => void;
}

export default function LogoSelector ({ onChange, defaultImage }: LogoSelectorProps) {
   const [image, setImage] = useState<string | undefined>(defaultImage || undefined);

   const onUploadImage = async (e: any) => {
      const file = e.target.files[0];

      const fileExtension = file.type.split("/")[1];
      if (!['png','jpg','jpeg'].includes(fileExtension)) {
         toast.error("Image must be png, jpg or jpeg");
         return;
      }

      setImage(LoadingImageCf.src);
      const url = await uploadImageToCloudinary(file);
      if (url !== '') {
         setImage(url as string);
         onChange(url as string);
      } else {
         toast.error("Failed to upload image");
         setImage(undefined);
      }
   }

   return (
      <div className="box full">
         {image ? (<>
            <div 
               className="box fit h-fit" 
               style={{
                  borderRadius: "12px", overflow: "hidden",
                  position: "relative", border: "1px solid #ececec",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.097)"
               }}
            >
               <div
                  className="box dfb align-center justify-center cursor-pointer"
                  style={{
                     width: "30px", aspectRatio: 1, borderRadius: "50%",
                     background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)",
                     position: "absolute", bottom: "10px", right: "10px", zIndex: 1,
                     boxShadow: "0 2px 3px rgba(0, 0, 0, 0.22)"
                  }}
                  onClick={() => setImage(undefined)}
               ><X size={17} /></div>
               <CustomUserIcon url={image} size={180} />
            </div>
         </>) : (<>
            <label htmlFor="image-upload">
               <input 
                  type="file" name="image-upload" 
                  id="image-upload" accept=".png, .jpg, .jpeg"
                  style={{ display: "none" }} onChange={onUploadImage}
               />
               <div
                  className="box full dfb align-center justify-center cursor-pointer"
                  style={{
                     border: "1px dashed #b3b3b3ff", maxWidth: "450px",
                     height: "50px", borderRadius: "12px"
                  }}
               >
                  <div className="text-xxs fit h-fit grey-4">Click here to choose image</div>
               </div>
            </label>
         </>)}
      </div>
   )
}

export function LogoViewer ({ base64ImageString }: { base64ImageString: string }) {
   return (<div className="box full">      
      <div 
         className="box fit h-fit" 
         style={{
            borderRadius: "12px", overflow: "hidden",
            border: "1px solid #ececec",
            boxShadow: "0 2px 4px rgba(0,0,0,0.097)"
         }}
      >
         <CustomUserIcon url={base64ImageString} size={180} />
      </div>
   </div>)
}