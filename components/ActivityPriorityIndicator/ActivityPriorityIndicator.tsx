'use client'
import { titleCase } from "@/lib/str"

export default function ActivityPriorityIndicator ({ priority }: { priority: ActivityPriority }) {
   const colors: Record<ActivityPriority, { bg: string, fg: string }> = {
      'low': { bg: "#a0680052", fg: "#a06800ff" },
      'medium': { bg: "#ff9f7293", fg: "#e64900ff" },
      'high': { bg: "#ff606052", fg: "#ff3333ff" }
   }

   return (
      <span 
         className="text-xt bold-600 fit pd-05 pdx-1"
         style={{
            background: colors[priority].bg,
            color: colors[priority].fg,
            borderRadius: "8px",
            display: "inline"
         }}
      >
         {titleCase(priority)}
      </span>
   )
}
