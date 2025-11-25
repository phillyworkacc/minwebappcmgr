'use client'

export default function Onboarding() {

   const sendEmails = () => {
      fetch("/api/cron/check-activities");
   }

   return (
      <div>
         <button onClick={sendEmails}>test email</button>
      </div>
   )
}
