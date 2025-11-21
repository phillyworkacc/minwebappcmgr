'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import ListClients from "./ListClients"
import AwaitButton from "@/components/AwaitButton/AwaitButton"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb"
import Select from "@/components/Select/Select"
import DateTimeSelector from "@/components/DateTimeSelector/DateTimeSelector"
import { useState } from "react"
import { CustomUserIcon, MinwebAppLogo } from "@/components/Icons/Icon"
import { CirclePlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { addActivity } from "../actions/activity"

type FormType = 'choose-client' | 'info'
type AddActivityPageProps = {
   allClients: Client[];
}

export default function AddActivityPage ({ allClients }: AddActivityPageProps) {
   const router = useRouter();
   const [formStep, setFormStep] = useState<FormType>('choose-client');

   const [chosenClient, setChosenClient] = useState<Client | null>(null);
   const [title, setTitle] = useState('');
   const [priority, setPriority] = useState<ActivityPriority>('low');
   const [dueDate, setDueDate] = useState('');

   const createActivityBtn = async (callback: Function) => {
      if (!chosenClient) return;
      if (title == "") {
         toast.error("Please enter a due title");
         callback();
         return;
      }
      if (dueDate == "") {
         toast.error("Please enter a due date");
         callback();
         return;
      }
      if (parseInt(dueDate) < Date.now()) {
         toast.error("Please enter a due date in the future");
         callback();
         return;
      }
      const added = await addActivity(title, priority, dueDate, chosenClient.clientid!);
      if (added.success) {
         toast.success("Added Activity");
         router.push(`/activity/${added.activityId}`);
      } else {
         toast.error("Failed to add activity");
      }
      callback();
   }

   return (
      <AppWrapper>
         <Breadcrumb 
            pages={[
               { href: "/activities", label: "Activities" },
               { href: "", label: "Add Activity" }
            ]}
         />
      
         {(formStep == "choose-client") && (<>
            <div className="box pd-1 full">
               <div className="text-xxxs grey-4 full">Minweb Activity</div>
               <div className="text-xl full bold-600">Choose Client</div>
               <div className="text-xxs full">Select the client this activity is being made for</div>
            </div>
            <ListClients
               allClients={allClients}
               chooseClient={client => {
                  setChosenClient(client);
                  setFormStep("info");
               }}
            />
         </>)}

         {(formStep == "info") && (<>
            <div className="box pd-1 full mb-1">
               <div className="box full dfb align-center gap-10">
                  <div className="text-xs grey-4 fit">Minweb Activity</div>
                  <div className="box dfb align-center fit">
                     <MinwebAppLogo size={30} />
                     <CustomUserIcon url={chosenClient?.image!} size={30} round />
                  </div>
               </div>
               <div className="text-xl full bold-600 pd-1">Activity for {chosenClient?.name}</div>
               <div className="text-xxs full">Please fill the fields below</div>
            </div>

            <div className="box full">
               <div className="box full pd-1 dfb column gap-10">
                  <div className="text-xs full bold-600 pd-05">Activity Title</div>
                  <input 
                     type="text" 
                     className="xxs pd-12 pdx-15 full" 
                     placeholder=""
                     onChange={e => setTitle(e.target.value)}
                     value={title}
                  />
               </div>

               <div className="box full pd-1 dfb column gap-10">
                  <div className="text-xs full bold-600 pd-05">Priority</div>
                  <Select
                     options={['Low','Medium','High']}
                     onSelect={option => setPriority(option.toLowerCase())}
                     defaultOptionIndex={0}
                  />
               </div>

               <div className="box full pd-1 dfb column gap-10">
                  <div className="text-xs full bold-600 pd-05">Due Date</div>
                  <DateTimeSelector onSelect={ms => setDueDate(ms)} />
               </div>

               <div className="box full pd-1">
                  <AwaitButton className="xxs pd-12 pdx-2" onClick={createActivityBtn}>
                     <CirclePlus size={17} /> Create Activity
                  </AwaitButton>
               </div>
            </div>
         </>)}
      
      </AppWrapper>
   )
}
