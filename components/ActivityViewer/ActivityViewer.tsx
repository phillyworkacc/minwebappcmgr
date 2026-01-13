'use client'
import "./ActivityViewer.css"
import Card from "../Card/Card"
import ActivityPriorityIndicator from "../ActivityPriorityIndicator/ActivityPriorityIndicator";
import { useRouter } from "next/navigation"
import { CustomUserIcon } from "../Icons/Icon";
import { formatMilliseconds } from "@/utils/date";

export function CompletionIndicator ({ complete }: { complete: boolean }) {
   return (
      <span 
         className="text-xt bold-600 fit pd-05 pdx-1"
         style={{
            background: complete ? '#adffad' : '#cccccc',
            color: complete ? '#008000' : '#222222',
            borderRadius: "8px",
            display: "inline"
         }}
      >{complete ? 'Completed' : 'Incomplete'}</span>
   )
}

export default function ActivityViewer ({ activityInfo }: { activityInfo: ActivityClient }) {
   const router = useRouter();

   return (
      <div className="box full dfb mb-1" style={{ maxWidth: "480px" }}>
         <Card 
            className="activity-view-card" 
            styles={{ padding: "20px", cursor: "pointer", boxShadow: "none" }} 
            cursor onClick={() => router.push(`/activity/${activityInfo.activityId}`)}
         >
            <div className="text-sm full bold-600 mb-05">{activityInfo.title}</div>
            <div className="box fit dfb align-center justify-center gap-10">
               <CustomUserIcon url={activityInfo.client.image} size={25} round />
               <div className="text-xxs fit">{activityInfo.client.name}</div>
            </div>
            <div className="box full dfb align-center gap-10 pd-1">
               <ActivityPriorityIndicator priority={activityInfo.priority} />
               <CompletionIndicator complete={activityInfo.completed} />
            </div>
            {activityInfo.completed ? (<>
               <div className="text-xxs full grey-5">Completed on {formatMilliseconds(parseInt(activityInfo.completeDate), true, true)}</div>
            </>) : (<>
               <div className="text-xxs full grey-5">Due on {formatMilliseconds(activityInfo.dueDate, true, true)}</div>
            </>)}
         </Card>
      </div>
   )
}
