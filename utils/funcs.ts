import { titleCase } from "@/lib/str";
import { Check, Rocket, Wrench, X } from "lucide-react";

export const zeroNumber = (num: number) => {
   return (num < 10) ? `0${num}` : num;
}

export const moneyFormatting = (number: number) => {
   let num = number.toFixed(2);
   let [numbersStr, decimalSide] = num.toString().split('.')
   let finalStr = ''
   let count = 0

   for (let i = (numbersStr.length)-1; i >= 0; i--) {
      let digitStr = numbersStr[i];
      count++;
      finalStr = (count == 3 && finalStr.substring(0,i) !== '') ? `,${digitStr}${finalStr}` : `${digitStr}${finalStr}`
      if (count == 3) count = 0;
   }

   return `${finalStr}.${decimalSide || '00'}`;
}

export const clientStatusInfo = (status: ClientStatus) => {
   if (status == "beginning") {
      return {
         name: titleCase(status),
         color: '#FACC15',
         desc: 'The project is in the early planning or setup phase'
      }
   } else if (status == "failed") {
      return {
         name: titleCase(status),
         color: '#EF4444',
         desc: 'The project was stopped, did not meet its objectives or the client did not want to continue'
      }
   } else if (status == "finished") {
      return {
         name: titleCase(status),
         color: '#3B82F6',
         desc: 'The project has been completed and delivered'
      }
   } else if (status == "working") {
      return {
         name: titleCase(status),
         color: '#22C55E',
         desc: 'The project is actively in progress and on track'
      }
   }
}

export function getInitialBgColor(name: string) {
   if (!name) return {
      backgroundColor: "#9e9e9e",
      textColor: "#fff"
   };

   // Simple string hash
   let hash = 0;
   for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
   }

   // Map hash to hue (0–359)
   const hue = Math.abs(hash) % 360;

   // Fixed saturation & lightness for consistency
   
   const lightness = Number(`hsl(${hue}, 65%, 55%)`.match(/(\d+)%\)$/)![1]);
   const textColor = lightness > 50 ? "#000" : "#fff";

   return {
      backgroundColor: `hsl(${hue}, 65%, 55%)`,
      textColor
   }
}

export function isValidUKMobile(number: string) {
   const cleaned = number.replace(/[\s-]/g, '');
   return /^(?:\+44|0)7\d{9}$/.test(cleaned);
}