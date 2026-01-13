"use client"
import "./AppWrapper.css"
import "@/styles/app.css"
import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CustomIcon, MinwebLogo } from '../Icons/Icon'
import { BookCopy, ChevronRight, CircleUserRound, Globe2, ListTodo, Menu, PoundSterling, TrendingUp, UserStar } from "lucide-react"
import { useModal } from "../Modal/ModalContext"
import userDefaultImage from "@/public/clientdefault.jpg"

export default function AppWrapper ({ children }: { children: ReactNode }) {
   const { data: session } = useSession();
   const router = useRouter();

   const { showModal, close } = useModal();
   const links = [
      { name: "Clients", href: "/clients", icon: <CircleUserRound size={17} />, color: "#880224" },
      { name: "Payments", href: "/payments", icon: <PoundSterling size={17} />, color: "#028802" },
      { name: "Client Forms", href: "/client-forms", icon: <BookCopy size={17} />, color: "#da6f45" },
      { name: "Revenue Insights", href: "/revenue", icon: <TrendingUp size={17} />, color: "#8704a8" },
      { name: "Reviews", href: "/reviews", icon: <UserStar size={17} />, color: "#c27400" },
      { name: "Activities", href: "/activities", icon: <ListTodo size={17} />, color: "#000875" },
      { name: "Websites", href: "/websites", icon: <Globe2 size={17} />, color: "#93c900" },
   ]

   const showHeaderLinksModalBtn = () => {
      showModal({
         content: <>
            <div className="text-l full bold-600 mb-15">Header Links</div>
            <div className="box full dfb column gap-10">
               {links.map(link => (
                  <div 
                     key={link.href}
                     className="box full dfb align-center gap-10 cursor-pointer pd-1"
                     onClick={() => {
                        router.push(link.href);
                        close();
                     }}
                  >
                     <div
                        className="box fit h-fit pd-1 pdx-1 dfb align-center justify-center"
                        style={{ aspectRatio: '1', borderRadius: "100%", background: `${link.color}`, color: "white" }}
                     >{link.icon}</div>
                     <div className="box full dfb align-center gap-5">
                        <div className="text-xxs bold-600 fit">{link.name}</div>
                        <ChevronRight size={15} />
                     </div>
                  </div>
               ))}
            </div>
            <div className="box full mt-1">
               <button className="xxs pd-1 full outline-black" onClick={close}>Close</button>
            </div>
         </>
      })
   }

   return (
      <div className="app">
         <div className="account-bar-wrapper">
            <div className="account-bar">
               <div className="app-icon">
                  <div className="app-icon-clickable" onClick={() => router.push("/")}>
                     <MinwebLogo size={40} />
                  </div>
               </div>
               <div className="box fit h-full pdx-1">
                  <button className="outline-black no-shadow pdx-05" onClick={showHeaderLinksModalBtn}>
                     <Menu />
                  </button>
               </div>
               <div className="account-image" onClick={() => router.push("/account")}>
                  <CustomIcon url={session?.user?.image! || userDefaultImage.src} size={40} round />
               </div>
            </div>
         </div>
         <div className="content">
            <div className="content-wrapper">
               <div className="box mb-05" />
               {children}
            </div>
         </div>
      </div>
   )
}