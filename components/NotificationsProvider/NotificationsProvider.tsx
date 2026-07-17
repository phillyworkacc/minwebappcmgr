'use client'
import { useEffect } from "react";
import { toast } from "sonner";

export default function NotificationsProvider ({ children }: { children: React.ReactNode }) {
   useEffect(() => {
      if ("serviceWorker" in navigator) {
         navigator.serviceWorker.register("/sw.js");
      }
   }, []);

   return (<>{children}</>)
}
