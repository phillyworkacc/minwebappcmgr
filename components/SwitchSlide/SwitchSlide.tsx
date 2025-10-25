"use client"
import "./SwitchSlide.css"
import { ReactNode, useState } from "react";

type SwitchSlideProps = {
   items: {
      label: ReactNode;
      key: string;
   }[];
   onItemSelected: (key: string) => void;
   defaultKeySelectedIndex?: number;
}

export default function SwitchSlide({ items, onItemSelected, defaultKeySelectedIndex }: SwitchSlideProps) {
   const [selectedOption, setSelectedOption] = useState(defaultKeySelectedIndex || 0);
   
   const selectOption = (optionIndex: number) => {
      setSelectedOption(optionIndex);
      onItemSelected(items[optionIndex].key)
   }

   return (
      <div className="switch-slide">
         {items.map((item, index) => (
            <div 
               key={index}
               className={`switch-item ${index == selectedOption && 'selected'}`} 
               onClick={() => selectOption(index)}
            >
               <div className="text-xxxs dfb align-center justify-center gap-5">{item.label}</div>
            </div>
         ))}
      </div>
   )
}
