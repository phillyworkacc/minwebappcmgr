'use client'
import { Circle, CircleCheck } from "lucide-react";
import { useState } from "react";

type CheckboxProps = {
   label: string;
   defaultChecked?: boolean;
   onChange: (value: boolean) => void;
}

export default function Checkbox ({ label, onChange, defaultChecked }: CheckboxProps) {
   const [checked, setChecked] = useState(defaultChecked || false)

   const onToggleCheck = () => {
      onChange(!checked);
      setChecked(c => !c);
   }

   return (
      <div className="box full dfb align-center gap-10 pd-05" onClick={onToggleCheck}>
         <div className="box fit h-full dfb align-center">
            {checked ? <CircleCheck size={22} fill="#1121ff" color="#fff" /> : <Circle size={22} />}
         </div>
         <div className="text-xs full h-full dfb">
            {label}
         </div>
      </div>
   )
}
