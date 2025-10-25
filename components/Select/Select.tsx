'use client'
import './Select.css'
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { CSSProperties, useEffect, useRef, useState } from 'react';

type SelectProps = {
   options: any[];
   onSelect: (option: any, index?: number) => void;
   defaultOptionIndex?: number;
   style?: CSSProperties;
   optionStyle?: CSSProperties;
   selectedOptionStyle?: CSSProperties;
}

export default function Select ({ options, defaultOptionIndex, onSelect, style, optionStyle, selectedOptionStyle }: SelectProps) {
   const [initialOption, setInitialOption] = useState(defaultOptionIndex || 0);
   const [showDropdown, setShowDropdown] = useState(false);
   const dropdownRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      function handleClickOutside(event: any) {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
         }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [dropdownRef]);

   return (
      <div className="select" style={style}>
         <div className="selected-option" onClick={() => setShowDropdown(prev => !prev)}>
            <div className="content" style={selectedOptionStyle}>{options[initialOption]}</div>
            <div className="arrow"><ChevronDown size={18} /></div>
         </div>
         {showDropdown && <motion.div 
            ref={dropdownRef}
            className="options-list"
            initial={{ y: -20, x: 0, opacity: 0 }}
            animate={{ y: 0, x: 0, opacity: 1 }}
            transition={{ duration: 0.1, ease: [.5,.91,.66,.95] }}
         >
            {options.map((option, index) => {
               return <div 
                  key={index} 
                  className="option"
                  style={optionStyle}
                  onClick={() => {
                     setInitialOption(index);
                     onSelect(option, index);
                     setShowDropdown(false);
               }}>{option}</div>
            })}
         </motion.div>}
      </div>
   )
}
