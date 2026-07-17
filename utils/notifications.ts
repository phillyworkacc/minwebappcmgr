import { toast } from "sonner";

export async function enableNotifications (userId: string) {
   try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") { console.log("Permission not granted"); return; }
   
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
         userVisibleOnly: true,
         applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });
   
      const response = await fetch("/api/push/subscribe", {
         method: "POST",
         body: JSON.stringify({ userId, subscription })
      });
      const data = await response.json();
      console.log(data);

      localStorage.setItem("client-minweb-enabled-notifications", "enabled");
   } catch (err) { console.log("Failed to enable notifications") }
}

function urlBase64ToUint8Array(base64String: string) {
   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

   const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

   const rawData = window.atob(base64);

   return Uint8Array.from(
      [...rawData].map((char) => char.charCodeAt(0))
   );
}