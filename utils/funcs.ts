import { titlize } from "./string";

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
         name: titlize(status),
         color: '#FACC15',
         desc: 'The project is in the early planning or setup phase'
      }
   } else if (status == "failed") {
      return {
         name: titlize(status),
         color: '#EF4444',
         desc: 'The project was stopped, did not meet its objectives or the client did not want to continue'
      }
   } else if (status == "finished") {
      return {
         name: titlize(status),
         color: '#3B82F6',
         desc: 'The project has been completed and delivered'
      }
   } else if (status == "working") {
      return {
         name: titlize(status),
         color: '#22C55E',
         desc: 'The project is actively in progress and on track'
      }
   }
}