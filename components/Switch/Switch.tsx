'use client'
import './Switch.css'

type SwitchProps = {
   value: boolean;
   onSwitch: Function;
}

export default function Switch ({ value, onSwitch }: SwitchProps) {
   return (
      <div className={`switch-ui ${value && 'on'}`} onClick={() => onSwitch()}>
         <div className="ball"></div>
      </div>
   )
}
