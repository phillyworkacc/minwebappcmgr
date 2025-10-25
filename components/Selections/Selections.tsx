'use client'
import './Selections.css'
import { useState } from 'react';

type SelectProps = {
   selections: any[];
   onSelect: (optionIndex: number) => void;
   defaultInitialIndex?: number;
}

export default function Selections ({ selections, onSelect, defaultInitialIndex }: SelectProps) {
   const [optionSelected, setOptionSelected] = useState<number>(defaultInitialIndex || 0);

   const selectOption = (index: number) => {
      setOptionSelected(index);
      onSelect(index);
   }

   return (
      <div className="selections">
         {selections.map((option, index) => (
            <div 
               key={index}
               className={`selection ${(optionSelected == index) && 'selected'}`}
               onClick={() => selectOption(index)}
            >
               <span className="text-xxxs">{option}</span>
            </div>
         ))}
      </div>
   )
}
