'use client'
import AppWrapper from '@/components/AppWrapper/AppWrapper'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Select from '@/components/Select/Select'
import ActivitiesTable from '@/components/Table/ActivitiesTable'
import Spacing from '@/components/Spacing/Spacing'
import { useRouter } from 'next/navigation'
import { titleCase } from '@/lib/str'
import { CirclePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import ActivityViewer from '@/components/ActivityViewer/ActivityViewer'

type ActivitiesPageProps = {
   allActivities: ActivityClient[];
}

export default function ActivitiesPage ({ allActivities }: ActivitiesPageProps) {
   const router = useRouter();
   const [activities, setActivities] = useState<ActivityClient[]>(allActivities);

   // filter states
   const [chartLabelIndex, setChartLabelIndex] = useState<number>(0)
   const [searchActivities, setSearchActivities] = useState('');
   const [filterActivityPriority, setFilterActivityPriority] = useState<ActivityPriority | 'all'>('all');
   const chartLabels = [ 'All', 'Low', 'Medium', 'High' ]

   useEffect(() => {
      filterByPriority(filterActivityPriority)
   }, [chartLabelIndex])

   function filterByPriority (activityPriority: ActivityPriority | 'all') {
      setFilterActivityPriority(activityPriority)
      if (activityPriority == "all") {
         setActivities(allActivities)
      } else {
         setActivities(allActivities.filter(client => client.priority == activityPriority))
      }
   }
   

   function filterByCompleted (completeFilter: string) {
      if (completeFilter == "all") {
         filterByPriority("all")
      } else if (completeFilter == "completed") {
         setActivities(activities.filter(a => (a.completed === true)));
      } else {
         setActivities(activities.filter(a => (a.completed === false)));
      }
   }

   return (
      <AppWrapper>
         <Breadcrumb 
            pages={[
               { href: "/activities", label: "Activities" }
            ]}
         />

         <div className="box full dfb align-center">
            <div className="text-m full bold-600 mt-15">Activity</div>
            <div className="box full dfb align-center justify-end">
               <button className="xxxs outline-black tiny-shadow pd-1 pdx-15" onClick={() => router.push("/add-activity")}>
                  <CirclePlus size={17} /> New Activity
               </button>
            </div>
         </div>
         
         <div className="htv">
            <div className="box full pd-1">
               <input 
                  type="text" 
                  className="xxs pd-11 pdx-15"
                  placeholder="Search Activities"
                  style={{ width: "100%", maxWidth: "400px" }}
                  value={searchActivities}
                  onChange={(e) => setSearchActivities(e.target.value)}
               />
            </div>
            <div className="box full dfb align-center justify-end gap-10">
               <Select
                  options={chartLabels.map(s => titleCase(s))}
                  onSelect={(option, index) => {
                     filterByPriority(option.toLowerCase())
                     setChartLabelIndex(index!);
                  }}
                  defaultOptionIndex={0}
                  style={{ width: "fit-content", borderRadius: "12px", boxShadow:"0 2px 5px rgba(0, 0, 0, 0.096)" }}
                  optionStyle={{ padding:"8px 12px" }}
               />
               <Select
                  options={['All','Completed','Incomplete']}
                  onSelect={option => filterByCompleted(option.toLowerCase())}
                  defaultOptionIndex={0}
                  style={{ width: "fit-content", borderRadius: "12px", boxShadow:"0 2px 5px rgba(0, 0, 0, 0.096)" }}
                  optionStyle={{ padding:"8px 12px" }}
               />
            </div>
         </div>

         <Spacing size={1} />
                  
         {(activities.length > 0) ? (<>
            {(activities.filter(
               activity => (
                  activity.title.toLowerCase().includes(searchActivities.toLowerCase()) || 
                  activity.markdownDescriptionText.toLowerCase().includes(searchActivities.toLowerCase())
               )
            ).length > 0) ? (<>
               {activities
                  .filter(activity => (
                     activity.title.toLowerCase().includes(searchActivities.toLowerCase()) ||
                     activity.markdownDescriptionText.toLowerCase().includes(searchActivities.toLowerCase())
                  ))
                  .map((activity, index) => (
                     <ActivityViewer key={index} activityInfo={activity} />
                  ))
               }
               <Spacing size={3} />
            </>) : (<>
               <div className="text-xxs full grey-5 text-center">No activities</div>
            </>)}
         </>) : (<>
            <div className="text-xxs full grey-5 text-center">No activities</div>
         </>)}
      </AppWrapper>
   )
}
