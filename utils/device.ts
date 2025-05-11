export function getDeviceType(navgtr: Navigator): 'mobile' | 'desktop' {
   const ua = navgtr.userAgent;
   if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      return 'mobile';
   } else {
      return 'desktop';
   }
}

export const getDeviceBrand = () => {
   const ua = navigator.userAgent.toLowerCase();

   if (ua.includes("iphone")) return "iPhone";
   if (ua.includes("ipad")) return "iPad";
   if (ua.includes("mac")) return "Mac";
   if (ua.includes("windows")) return "Windows PC";
   if (ua.includes("android")) {
      if (ua.includes("samsung")) return "Samsung";
      return "Android (Unknown Brand)";
   }
   return "Unknown Device";
}

export function isMobileDevice() {
   return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function getUserOS(): 'Windows' | 'iOS' | 'macOS' | 'Android' | 'Linux' | 'Unknown' {
   const userAgent = navigator.userAgent || navigator.vendor;

   if (/Windows NT/i.test(userAgent)) return 'Windows';
   if (/Macintosh/i.test(userAgent)) return 'macOS';
   if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
   if (/Android/i.test(userAgent)) return 'Android';
   if (/Linux/i.test(userAgent)) return 'Linux';

   return 'Unknown';
}

