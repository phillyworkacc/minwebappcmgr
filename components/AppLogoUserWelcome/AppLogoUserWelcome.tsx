'use client'

import { useState } from 'react';
import './AppLogoUserWelcome.css'
import { MoonStar, Sun } from 'lucide-react';
import { updateUserColorTheme } from '@/app/Actions/User';
import { useUser } from '@/app/context/UserContext';
import { appLogo } from '@/utils/constants';
import { MinwebIcon } from '../Icons/Icons';

type AppLogoUserWelcomeProps = {
   name: string;
}

export default function AppLogoUserWelcome({ name }: AppLogoUserWelcomeProps) {
   const { user, setUser } = useUser();
   const [theme, setTheme] = useState<ColorTheme>(user?.color_theme!);

   const switchTheme = async () => {
      if (theme == "light"){
         setUser({ ...user!, color_theme: "dark" });
         setTheme("dark")
         let result = await updateUserColorTheme("dark");
         setTheme(result ? "dark" : "light");
         setUser({ ...user!, color_theme: result ? "dark" : "light" });
      } else {
         setUser({ ...user!, color_theme: "light" });
         setTheme("light")
         let result = await updateUserColorTheme("light");
         setTheme(result ? "light" : "dark");
         setUser({ ...user!, color_theme: result ? "light" : "dark" });
      }
   }

   return (
      <div className="app-logo-user-welcome">
         <div className="text-c-s dfb gap-5">
            <MinwebIcon size={22} /> <div className="text-c-s">Welcome {name}</div>
         </div>
         <div className={`theme-switcher ${user?.color_theme == "light" ? 'left' : 'right'}`} onClick={switchTheme}>
            <div className="switch-ball">
               {theme == "light" ? <Sun size={20} /> : <MoonStar size={20} />}
            </div>
         </div>
      </div>
   )
}
