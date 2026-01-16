'use client'
import Card from "../Card/Card";
import AwaitButton from "../AwaitButton/AwaitButton";
import MultiActionDropdown from "../MultiActionDropdown/MultiActionDropdown";
import { titleCase } from "@/lib/str";
import { onboardingFormConfig } from "@/utils/onboardingFormConfig";
import { formatMilliseconds } from "@/utils/date";
import { MultipleColorViewer } from "../MultipleColorChooser/MultipleColorChooser";
import { LogoViewer } from "../LogoSelector/LogoSelector";
import { Calendar, ListTodo, UserPlus } from "lucide-react";
import { addActivityFromClientForm, addMeetingToGoogleCalendar, createClientUsingForm } from "@/app/actions/clientForm";
import { toast } from "sonner";

type AdminClientFormProps = {
   clientForm: ClientForm;
}

export default function AdminClientForm ({ clientForm }: AdminClientFormProps) {
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

   const createClientAccount = async (callback: Function) => {
      const { business_name, email: business_email, phone: business_phone } = clientForm.business_information;
      const { niche } = clientForm.niche;
      const notes = `Business Name: ${business_name}
Business Email: ${business_email}
Business Phone: ${business_phone}`;
      const { first_name, last_name, email, profile_image, phone } = clientForm.your_information;
      const createClient = await createClientUsingForm(`${first_name} ${last_name}`, email, notes, profile_image, niche, phone, "template-build-site");
      if (createClient.success) {
         toast.success("Created Client Account");
      } else {
         toast.error(createClient.error);
      }
      callback();
   }

   const addMeetingDateToCalender = async () => {
      const { first_name, last_name, email } = clientForm.your_information;
      const { meeting_date } = clientForm.website_delivery;
      const addedToCalendar = await addMeetingToGoogleCalendar(`${first_name} ${last_name}`, email, parseInt(meeting_date));
      if (addedToCalendar) {
         toast.success("Added Meeting Date to Calendar");
      } else {
         toast.error("Failed to add meeting to calendar");
      }
   }

   const addWebsiteBuildAsActivity = async () => {
      const { business_name, email: business_email, phone: business_phone } = clientForm.business_information;
      const { new_website_purpose, required_pages } = clientForm.website_information;
      const { first_name, last_name, email } = clientForm.your_information;
      const { logo } = clientForm.branding_assets;
      const { show_social_media } = clientForm.social_media;
      const { delivery_date } = clientForm.website_delivery;
      const safeMd = (str: any) => typeof str == "string" ? str.replace(/^#/gm, "\\#") : "undefined";
      const markdownDesc = `## Business Info
### Business Name
${safeMd(business_name)}
### Business Email
${safeMd(business_email)}
### Business Phone
${safeMd(business_phone)}

## Website Information
### New Website Purpose
${safeMd(new_website_purpose)}
### Required Pages
${safeMd(required_pages.join(", "))}
### Current Website
${safeMd(clientForm.website_information['current_website'])}
### What ${first_name} ${last_name} dislikes about the current website?
${safeMd(clientForm.website_information['current_website_dislikes'])}
${clientForm.website_information['integrations'] && (`### Integrations Requested
${safeMd(clientForm.website_information['integrations'].join(", "))}`)}

## Branding Assets
### Logo
![](${logo})
### Colours
${safeMd(clientForm.branding_assets['colours'].join(", "))}
### Fonts
${safeMd(clientForm.branding_assets['fonts'])}

## Social Media
${show_social_media ? "Add" : "Don't show"} their social media platforms to the website
### Instagram
${safeMd(clientForm.branding_assets['instagram'])}
### YouTube
${safeMd(clientForm.branding_assets['youtube'])}
### TikTok
${safeMd(clientForm.branding_assets['tiktok'])}
### LinkedIn
${safeMd(clientForm.branding_assets['linkedin'])}
### Facebook
${safeMd(clientForm.branding_assets['facebook'])}
`;

      const addedActivity = await addActivityFromClientForm(`Website Build for ${first_name} ${last_name}`, email, "high", markdownDesc, delivery_date);
      if (addedActivity) {
         toast.success("Added Website Build to Activities");
      } else {
         toast.error("Failed to add activity");
      }
   }

   return (
      <>
         {Object.keys(clientForm).map((key, index) => {
            return (<div key={index} className="box full mb-2">
               <div className="box full dfb align-center gap-10">
                  <div className="text-l bold-700 pd-05">{titleCase(key)}</div>
                  {(key == "website_delivery") && (
                     <div className="box fit">
                        <MultiActionDropdown
                           actions={[
                              { label: <><Calendar size={17} /> Add Meeting to Calendar</>, appearance: "normal", action: addMeetingDateToCalender },
                              { label: <><ListTodo size={17} /> Create Activity for Website Delivery</>, appearance: "normal", action: addWebsiteBuildAsActivity }
                           ]}
                        />
                     </div>
                  )}
               </div>
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
                  {(key == "your_information") && (<div className="box full dfb column pd-15">
                     <AwaitButton className="xxs pd-12 pdx-2 fit" onClick={createClientAccount}>
                        <UserPlus size={17} /> Create Client Account
                     </AwaitButton>
                  </div>)}
               </Card>
            </div>)
         })}
      </>
   )
}
