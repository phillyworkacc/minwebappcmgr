"use client"
import { X } from 'lucide-react';
import { useState } from 'react'
import { toast } from 'sonner';

type MultipleColorChooserProps = {
   defaultColours?: string[];
   onChange: (colours: string[]) => void;
}

export default function MultipleColorChooser ({ onChange, defaultColours }: MultipleColorChooserProps) {
   const [colours, setColours] = useState<string[]>(defaultColours || []);
   const [hexCode, setHexCode] = useState('');

   function isValidHexColor(str: string) {
      return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(str);
   }

   const addColour = () => {
      if (hexCode.replaceAll("#","").length !== 6 || !isValidHexColor(`#${hexCode.replaceAll("#","")}`)) {
         toast.error("Please enter a valid hex code");
         return;
      }
      onChange([ hexCode.replaceAll("#",""), ...colours ]);
      setColours(c => ([ hexCode.replaceAll("#",""), ...c ]));
      setHexCode("");
   }

   return (
      <div className='box full dfb column gap-10'>
         <div className="box full dfb wrap gap-10">
            {colours.length == 0 && <span className="text-xxs grey-4">No colours chosen</span>}
            {colours.map((colour, index) => (
               <div 
                  key={index} 
                  className="box fit dfb align-center gap-10 pd-1 pdx-1" 
                  style={{ border: "1px solid #ececec", borderRadius: "12px", height: "50px" }}
               >
                  <div 
                     style={{
                        background: `#${colour}`, height: "100%", border: "1px solid #ececec",
                        aspectRatio: 1, borderRadius: "12px"
                     }}
                  />
                  <div className="text-xxs bold-700 full">#{colour.toUpperCase()}</div>
                  <div className="box fit h-full dfb align-center error-text cursor-pointer" onClick={() => setColours(c => (c.filter(col=> (col !== colour))))}>
                     <X size={15} color='#ff0000' />
                  </div>
               </div>
            ))}
         </div>
         <div className="box full dfb align-center gap-10">
            <input 
               type="text"
               className="xxs pd-12 pdx-2 full"
               placeholder="Enter Colour Code"
               id="colour-code" name="colour-code"
               value={hexCode} onChange={e => setHexCode(e.target.value)}
            />
            <button className="xxs fit pd-12 pdx-2" onClick={addColour}>Add</button>
         </div>
      </div>
   )
}

export function MultipleColorViewer ({ colours }: { colours: string[] }) {
   return (
      <div className="box full dfb wrap gap-10">
         {colours.length == 0 && <span className="text-xxs grey-4">No colours chosen</span>}
         {colours.map((colour, index) => (
            <div 
               key={index} 
               className="box fit dfb align-center gap-10 pd-1 pdx-1" 
               style={{ border: "1px solid #ececec", borderRadius: "12px", height: "50px" }}
            >
               <div 
                  style={{
                     background: `#${colour}`, height: "100%", border: "1px solid #ececec",
                     aspectRatio: 1, borderRadius: "12px"
                  }}
               />
               <div className="text-xxs bold-700 full">#{colour.toUpperCase()}</div>
            </div>
         ))}
      </div>
   )
}
