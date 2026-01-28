'use client'
import Card from "@/components/Card/Card"
import Select from "@/components/Select/Select";
import Spacing from "@/components/Spacing/Spacing";
import { updateAutomation } from "@/app/actions/automations";
import { titleCase } from "@/lib/str";
import { useState } from "react";
import { toast } from "sonner";

type AutomationsSectionProps = {
   clientInfo: Client;
   automations: Automation[];
}

export default function AutomationsSection ({ clientInfo, automations }: AutomationsSectionProps) {
   const [clientAutomations, setClientAutomations] = useState<Automation[]>(automations);
   const delayOptions = [
      { label: "30 mins", value: 30 * 60 * 1000 },
      { label: "1 hour", value: 60 * 60 * 1000 },
      { label: "2 hours", value: 2 * 60 * 60 * 1000 },
      { label: "8 hours", value: 8 * 60 * 60 * 1000 },
      { label: "1 day", value: 24 * 60 * 60 * 1000 },
      { label: "2 days", value: 2 * 24 * 60 * 60 * 1000 },
      { label: "3 days", value: 3 * 24 * 60 * 60 * 1000 },
      { label: "1 month", value: 30 * 24 * 60 * 60 * 1000 }
   ]
   const automationsList = [
      {
         type: "review",
         description: `Ask ${clientInfo.businessName}'s customers for a review once they complete a job.`
      },
      {
         type: "referral",
         description: `Ask for a referral from ${clientInfo.businessName}'s customers.`
      }
   ]

   const saveAutomationChanges = async (type: string) => {
      const automationToSave = clientAutomations.find(a => a.type == type)!;
      const { automationId, clientId } = automationToSave;
      const result = await updateAutomation(automationId, clientId, automationToSave);
      if (result) {
         toast.success(`Updated ${type} automation`);
      } else {
         toast.error(`Failed to update ${type} automation`);
      }
   }

   const toggleAutomationAbility = (action: "disable" | "enable", type: string) => {
      if (action === "disable") {
         setClientAutomations(prev => ([
            ...prev.filter(a => a.type !== type),
            {
               ...prev.find(a => a.type == type)!, enabled: false
            }
         ]));
      } else if (action === "enable") {
         setClientAutomations(prev => ([
            ...prev.filter(a => a.type !== type),
            {
               ...prev.find(a => a.type == type)!, enabled: true
            }
         ]));
      }
   }

   const changeAutomation = (type: string, newInfo: { message?: string, delay?: number }) => {
      setClientAutomations(prev => ([
         ...prev.filter(a => a.type !== type),
         {
            ...prev.find(a => a.type == type)!,
            message: newInfo.message || prev.find(a => a.type == type)!.message,
            delay: newInfo.delay || prev.find(a => a.type == type)!.delay
         }
      ]));
   }

   return (
      <div className="box full pd-15">
         <Card styles={{padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.098)"}}>
            <div className="text-sm full bold-700 mb-1">Automations</div>
            <div className="box full dfb column gap-20 pd-1">
               {clientAutomations.sort((a, b) => (a.type == "review" ? -1 : 1)).map((automation, index) => (
                  <div className="box full" key={automation.type}>                     
                     <div className="box dfb full">
                        <div className="box full">
                           <div className="text-s full bold-600 mb-05">{titleCase(automation.type)} Automation</div>
                           <div className="text-xxxs full grey-4">{automationsList.find(a => a.type == automation.type)!.description}</div>
                           <div className="text-xxs bold-500 mt-1">Timeout</div>
                           <div className="box full pd-05">
                              <Select
                                 options={delayOptions.map(d => d.label)}
                                 onSelect={(o, delayIndex) => {
                                    if (delayIndex) changeAutomation(automation.type, { delay: delayOptions[delayIndex].value });
                                 }}
                                 style={{ borderRadius: "15px" }}
                              />
                           </div>
                           <div className="text-xxs bold-500 mt-1">Message</div>
                           <div className="box full pd-05">
                              <textarea 
                                 className="xxxs pd-15 pdx-2 full h-15"
                                 style={{ borderRadius: "15px" }}
                                 placeholder="Enter your message"
                                 value={automation.message}
                                 onChange={e => changeAutomation(automation.type, { message: e.target.value })}
                              />
                           </div>
                           <div className="text-xxs bold-500 mt-1">Preview Message</div>
                           <div className="text-xxxs full pd-05" style={{ whiteSpace: "pre-wrap" }}>
                              {automation.message
                                 .replaceAll("{{business_name}}", clientInfo.businessName)
                                 .replaceAll("{{customer_name}}", 'Customer')
                           }</div>
                           <div className="box full pd-1">
                              <button 
                                 className="xxxs pd-1 pdx-3" 
                                 onClick={() => saveAutomationChanges(automation.type)}
                              >Save Changes</button>
                           </div>
                           <Spacing size={2} />
                        </div>
                        <div className="box fit">
                           {(clientAutomations.find(a => a.type == automation.type))?.enabled ? (<>
                              <button 
                                 className="xxxs delete" 
                                 onClick={() => toggleAutomationAbility("disable", automation.type)}
                              >Disable</button>
                           </>) : (<>
                              <button
                                 className="xxxs green" 
                                 onClick={() => toggleAutomationAbility("enable", automation.type)}
                              >Enable</button>
                           </>)}
                        </div>
                     </div>
                     {index < 1 && (<>
                        <hr /><Spacing size={1} />
                     </>)}
                  </div>
               ))}
            </div>
         </Card>
      </div>
   )
}
