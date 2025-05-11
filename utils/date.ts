export const formatDate = (day: number, month: number, year: number) => {
   const date = new Date(year, month - 1, day);
   return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
   });
}

export function formatDateV2(ms: number) {
   const date = new Date(ms);
   return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateTime(ms: number) {
   const date = new Date(ms);
   return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
   }).replace(',', '');
}

export function formatDateForMinwebAnalytic(ms: number) {
   const now = Date.now();
   const diffMs = now - ms;
   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
   
   const date = new Date(ms);
   let hours = date.getHours();
   const minutes = String(date.getMinutes()).padStart(2, '0');
   const period = hours >= 12 ? 'pm' : 'am';
   hours = hours % 12 || 12; // convert to 12-hour format

   if (diffDays < 1) return `today, ${hours}:${minutes} ${period}`;
   if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago, ${hours}:${minutes} ${period}`;

   const day = date.getDate();
   const month = date.toLocaleString('en-GB', { month: 'long' });
   const year = date.getFullYear();

   return `on ${day} ${month} ${year}, ${hours}:${minutes} ${period}`;
}
