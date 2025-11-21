'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor";
import Spacing from "@/components/Spacing/Spacing";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import { CustomUserIcon } from "@/components/Icons/Icon";
import { CircleCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteActivity, updateActivityCompletion } from "@/app/actions/activity";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ActivityPageProps = {
   activityInfo: ActivityClient;
}

export default function ActivityPage ({ activityInfo }: ActivityPageProps) {
   const [activity, setActivity] = useState<ActivityClient>(activityInfo);
   const router = useRouter();

   const markAsComplete = async (callback: Function) => {
      setActivity(prev => ({ ...prev, completed: true, completeDate: `${Date.now()}` }));
      const marked = await updateActivityCompletion(activity.activityId, true);
      if (marked) {
         toast.success("Completed");
      } else {
         toast.error("Failed to mark activity as completed");
         setActivity(prev => ({ ...prev, completed: false, completeDate: '' }));
      }
      callback();
   }


   const markAsIncomplete = async (callback: Function) => {
      setActivity(prev => ({ ...prev, completed: false }));
      const marked = await updateActivityCompletion(activity.activityId, false);
      if (marked) {
         toast.success("Marked as incomplete");
      } else {
         toast.error("Failed to mark activity as incomplete");
         setActivity(prev => ({ ...prev, completed: true, completeDate: activityInfo.completeDate }));
      }
      callback();
   }

   const deleteCurrentActivity = async () => {
      if (confirm("Are you sure you want to delete this activity ?")) {
         const deleted = await deleteActivity(activityInfo.activityId);
         if (deleted) {
            toast.success("Deleted activity");
            router.push('/activities');
         } else {
            toast.error("Failed to delete this activity");
         }
      }
   }
   
   return (
      <AppWrapper>
         <Breadcrumb
            pages={[
               { href: "/activities", label: "Activities" },
               { href: "", label: activity.client.name },
            ]}
         />
         <Spacing size={1} />

         <div className="text-xl full bold-700 pd-1">{activity.title}</div>

         <div className="box full dfb align-center justify-end gap-30">
            <div className="box fit dfb align-center justify-center gap-10">
               <CustomUserIcon url={activity.client.image} size={25} round />
               <div className="text-xxs fit">{activity.client.name}</div>
            </div>
            <div className="box fit dfb align-center gap-10">
               {activity.completed ? (<>
                  <AwaitButton className="xxs pd-1 pdx-15 tiny-shadow grey whitespace-nowrap" blackSpinner onClick={markAsIncomplete}>
                     <CircleCheck size={15} /> Mark as incomplete
                  </AwaitButton>
               </>) : (<>
                  <AwaitButton className="xxs pd-1 pdx-15 tiny-shadow green whitespace-nowrap" onClick={markAsComplete}>
                     <CircleCheck size={15} /> Mark as complete
                  </AwaitButton>
               </>)}
               <AwaitButton className="xxs pd-1 pdx-15 tiny-shadow delete whitespace-nowrap" onClick={deleteCurrentActivity}>
                  <Trash2 size={15} /> Delete Activity
               </AwaitButton>
            </div>
         </div>
         <Spacing size={1} />
         <MarkdownEditor markdownInitial={activity.markdownDescriptionText} activityId={activity.activityId} />
      </AppWrapper>
   )
}
