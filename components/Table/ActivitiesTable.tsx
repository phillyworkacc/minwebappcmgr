'use client'
import './Table.css'
import { formatMilliseconds } from '../../utils/date';
import { CustomUserIcon } from '../Icons/Icon';
import ActivityPriorityIndicator from '../ActivityPriorityIndicator/ActivityPriorityIndicator';

type ActivitiesTableProps = {
   activities: ActivityClient[];
   onClickActivity?: (activity: ActivityClient) => void;
}

function CompletionIndicator ({ complete }: { complete: boolean }) {
   return (
      <span 
         className="text-xxxs bold-600 fit pd-05 pdx-1"
         style={{
            background: complete ? '#adffad' : '#cccccc',
            color: complete ? '#008000' : '#222222',
            borderRadius: "8px",
            display: "inline"
         }}
      >{complete ? 'Completed' : 'Incomplete'}</span>
   )
}

export default function ActivitiesTable ({ activities, onClickActivity }: ActivitiesTableProps) {
   return (
      <div className="video-ideas-manage">
         <div className="table-container">
            <table className="video-idea-table">
               <thead>
                  <tr id='head-row'>
                     <th>Name</th>
                     <th style={{textAlign:"center"}}>Priority</th>
                     <th style={{textAlign:"center"}}>Client</th>
                     <th style={{textAlign:"center"}}>Due Date</th>
                     <th style={{textAlign:"center"}}>Complete</th>
                  </tr>
               </thead>
               <tbody>
                  {activities.map((activity, index) => (
                     <tr key={index} onClick={() => { if (onClickActivity) onClickActivity(activity); }}>
                        <td className='name' style={{
                           whiteSpace: 'nowrap', overflow: 'hidden',
                           textOverflow: 'ellipsis', fontWeight: "600"
                        }}> 
                           {activity.title}
                        </td>
                        <td style={{textAlign: "center"}}><ActivityPriorityIndicator priority={activity.priority} /></td>
                        <td style={{textAlign:"center"}}>
                           <div className="box fit dfb align-center justify-center gap-10">
                              <CustomUserIcon url={activity.client.image} size={25} round />
                              <div className="text-xxs fit">{activity.client.name}</div>
                           </div>
                        </td>
                        <td style={{textAlign:"center"}}>{formatMilliseconds(parseInt(activity.dueDate), true, true)}</td>
                        <td style={{textAlign:"center"}}>
                           <CompletionIndicator complete={activity.completed} />
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   )
}
