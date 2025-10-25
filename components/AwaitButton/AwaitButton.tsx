'use client'
import { wait } from "@/utils/wait";
import { useState } from "react";
import Spinner from "../Spinner/Spinner";

type AwaitButtonProps = {
   className: string;
   onClick: Function;
   children: React.ReactNode;
   waitTime?: number;
   afterRunFunction?: Function;
   blackSpinner?: boolean;
}

export default function AwaitButton ({ children, onClick, className, waitTime, afterRunFunction, blackSpinner }: AwaitButtonProps) {
   const [loadingState, setLoadingState] = useState(false);

   const callback = () => setLoadingState(false);

   const clickBtn = async () => {
      setLoadingState(true);
      await wait(waitTime || 0.25)
      onClick(callback);
      if (afterRunFunction) afterRunFunction();
      return;
   }
   return (
      <button className={className} onClick={clickBtn} disabled={loadingState}>
         {loadingState ? <>
            <Spinner black={blackSpinner} /> {children}
         </> : children}
      </button>
   )
}
