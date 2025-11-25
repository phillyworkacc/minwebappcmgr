import { titleCase } from "@/lib/str";
import { formatMilliseconds } from "@/utils/date";

export default function activityEmail (activities: ActivityClient[]) {
   if (!process.env.NEXTAUTH_URL) return '';
   const baseurl = process.env.NEXTAUTH_URL;

   return `
   <!doctype html>
   <html>
   <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Activity Reminder</title>
      <style>
         /* General resets */
         img {border:0; -ms-interpolation-mode:bicubic; display:block;}
         a {color:inherit; text-decoration:none;}
         body {margin:0; padding:0; background-color:#f2f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;}

         /* Container */
         .email-wrap {width:100%; background-color:#f2f4f7; padding:24px 0;}
         .email-body {max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden;}

         /* Header */
         .header {padding:20px 24px; background:linear-gradient(90deg,#1121ff,#3b82f6); color:#ffffff;}
         .brand {font-size:18px; font-weight:700;}
         .greeting {margin-top:6px; font-size:14px; opacity:0.95;}

         /* Content */
         .content {padding:20px 24px; color:#0f172a;}
         .intro {font-size:15px; line-height:1.5; margin-bottom:16px;}

         /* Activities list */
         .activity-list {width:100%; border-collapse:collapse;}
         .activity-row {border-top:1px solid #eef2f7; padding:12px 0;}
         .activity-title {font-size:15px; font-weight:600; color:#0f172a;}
         .activity-meta {font-size:13px; color:#475569; margin-top:6px;}
         .activity-action {display:inline-block; margin-top:10px; padding:8px 12px; border-radius:6px; background:#1121ff; color:#fff; font-weight:600; font-size:13px;}

         /* Footer */
         .footer {padding:16px 24px; font-size:12px; color:#94a3b8;}
         .small-link {color:#6b7280; text-decoration:underline;}

         /* Mobile */
         @media screen and (max-width:480px){
            .email-body {margin:0 12px;}
            .header {padding:16px}
            .content {padding:16px}
         }
      </style>
   </head>
   <body>
      <div class="email-wrap">
         <div class="email-body" role="article" aria-roledescription="email">

            <!-- Header -->
            <div class="header">
               <div class="brand">MinWeb</div>
               <div class="greeting">Hi Philip — activities due tomorrow (<strong>${formatMilliseconds(Date.now(), true)}</strong>)</div>
            </div>

            <!-- Content -->
            <div class="content">
               <p class="intro">Here are the activities due tomorrow. Click an activity or the button to open it in your CMS.</p>

               <!-- Activities table: repeat the <tr class="activity-row"> block for each activity -->
               <table class="activity-list" role="list">
                  ${
                  activities.map(activity => (`
                     <tr class="activity-row" role="listitem">
                        <td style="padding:14px 0;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
                           <div style="flex:1; min-width:0;">
                              <a href="${baseurl}/activity/${activity.activityId}" target="_blank" style="color:inherit;">
                              <div class="activity-title">${activity.title}</div>
                              <div class="activity-meta">
                                 Client: ${activity.client.name} • Due: ${formatMilliseconds(parseInt(activity.dueDate))} • Priority: ${titleCase(activity.priority)}
                              </div>
                              </a>
                           </div>
                           <div style="white-space:nowrap;">
                              <a href="${baseurl}/activity/${activity.activityId}" target="_blank" class="activity-action">Open</a>
                           </div>
                        </div>
                        </td>
                     </tr>
                  `))
                  }
               </table>

               <!-- Summary CTA -->
               <p style="margin-top:18px;">
                  <a href="${baseurl}/activities" target="_blank" style="display:inline-block; padding:10px 14px; border-radius:8px; background:#1121ff; color:#fff; font-weight:600;">
                     Open dashboard
                  </a>
               </p>

            </div>

            <!-- Footer -->
            <div class="footer">
               <div>Sent by MinWeb</div>
            </div>
         </div>
      </div>
   </body>
   </html>
   `;
}