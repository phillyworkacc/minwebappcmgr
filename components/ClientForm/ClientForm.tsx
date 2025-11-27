'use client'
import Card from "../Card/Card";
import { titleCase } from "@/lib/str";
import { onboardingFormConfig } from "@/utils/onboardingFormConfig";
import { formatMilliseconds } from "@/utils/date";
import { MultipleColorViewer } from "../MultipleColorChooser/MultipleColorChooser";
import { LogoViewer } from "../LogoSelector/LogoSelector";

type ClientFormProps = {
   clientForm: ClientForm;
}

export default function ClientForm ({ clientForm }: ClientFormProps) {
   const renderKeyValue = (key1: string, key2: string) => {
      const valueType = onboardingFormConfig.find(f => f.id == key1)?.formContent.find(formItem => formItem.id == key2)?.type;
      if (!valueType) return;
      switch (valueType) {
         case "text":
            return <div className="text-xs full">{(clientForm as any)[key1][key2]}</div>
            
         case "select":
            return <div className="text-xs full">{(clientForm as any)[key1][key2]}</div>
            
         case "number":
            return <div className="text-xs full">{(clientForm as any)[key1][key2]}</div>
            
         case "email":
            return <div className="text-xs full">{(clientForm as any)[key1][key2]}</div>
            
         case "textarea":
            return <div className="text-xs full">{(clientForm as any)[key1][key2]}</div>
            
         case "date":
            return <div className="text-xs full">{formatMilliseconds(parseInt((clientForm as any)[key1][key2]))}</div>
            
         case "multipleChoices":
            return <div className="text-xs full">{(clientForm as any)[key1][key2].join(", ")}</div>
            
         case "checkbox":
            return <div className="text-xs full">{(clientForm as any)[key1][key2] ? "Yes" : "No"}</div>
            
         case "colours":
            return <div className="box full">
               <MultipleColorViewer colours={(clientForm as any)[key1][key2]} />
            </div>
            
         case "image":
            return <div className="box full">
               <LogoViewer base64ImageString={(clientForm as any)[key1][key2]} />
            </div>
      }
   }

   return (
      <>
         {Object.keys(clientForm).map((key, index) => {
            return (<div key={index} className="box full mb-2">
               <div className="text-l bold-700 pd-05">{titleCase(key)}</div>
               <Card
                  styles={{
                     background: "#f8f8f8", boxShadow: "none", width: "100%",
                     padding: "20px"
                  }}
               >
                  {Object.keys((clientForm as any)[key]).map((key2, index2) => (
                     <div key={index2} className="box full dfb column mb-15">
                        <div className="text-xxs bold-700 full">{titleCase(key2)}</div>
                        <div className="box full pd-05">
                           {renderKeyValue(key, key2)}
                        </div>
                     </div>
                  ))}
               </Card>
            </div>)
         })}
      </>
   )
}
