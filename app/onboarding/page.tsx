'use client'
import OnboardingWrapper from "@/components/AppWrapper/OnboardingWrapper";
import Checkbox from "@/components/Checkbox/Checkbox";
import ClientForm from "@/components/ClientForm/ClientForm";
import DateTimeSelector from "@/components/DateTimeSelector/DateTimeSelector";
import LogoSelector from "@/components/LogoSelector/LogoSelector";
import MultipleColorChooser from "@/components/MultipleColorChooser/MultipleColorChooser";
import Select from "@/components/Select/Select";
import Selections from "@/components/Selections/Selections";
import Spacing from "@/components/Spacing/Spacing";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import { onboardingFormConfig } from "@/utils/onboardingFormConfig";
import { ArrowLeft, ArrowRight, Asterisk, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createClientForm } from "../actions/clientForm";

export default function Onboarding() {
   const [formStage, setFormStage] = useState(0);
   const [clientForm, setClientForm] = useState<ClientForm>({
      niche: { niche: '' },
      your_information: {
         first_name: undefined,
         last_name: undefined,
         email: undefined,
         phone: undefined,
         preferred_contact: '',
      },
      business_information: {
         business_name: undefined,
         email: undefined,
         phone: undefined,
      },
      website_information: {
         new_website_purpose: undefined,
         required_pages: undefined,
      },
      branding_assets: {
         logo: '',
      },
      social_media: { show_social_media: false },
      website_delivery: {
         meeting_date: undefined,
         delivery_date: undefined,
      }
   });
   const [showSuccess, setShowSuccess] = useState(false);

   function updateClientForm (formItem: FormItem, value: any) {
      setClientForm(cf => ({
         ...cf, 
         [onboardingFormConfig[formStage].id]: {
            ...cf[onboardingFormConfig[formStage].id],
            [formItem.id]: value
         }
      }))
   }

   function nextButton () {
      const formStageRequiredKeys = Object.keys(clientForm[onboardingFormConfig[formStage].id]);
      if (formStageRequiredKeys
            .map(fsRk => clientForm[onboardingFormConfig[formStage].id][fsRk])
            .some(v => (v==undefined || v==='' || v.length < 1))
      ) {
         toast.error("Please fill all the required fields");
         return;
      }
      setFormStage(p => p+1);
   }

   const submitClientFormForReview = async (callback: Function) => {
      const submitted = await createClientForm(clientForm);
      if (submitted) {
         setShowSuccess(true);
         localStorage.removeItem("minweb_agency_onboarding_form");
         localStorage.removeItem("minweb_agency_onboarding_form_stage");
      } else {
         toast.error("Failed to submit form for review. Please try again later.");
      }
      callback();
   }

   return (
      <OnboardingWrapper>
         <div className="text-xl bold-600 full mb-2">Minweb Website Form</div>

         {(showSuccess) ? (<>
            <div className="text-ml full bold-600 mb-1" style={{ color: "#005700" }}>Successfully Submitted</div>
            <div className="text-xs pd-1 full">Your form has been submitted, please wait between 1 - 12 hours to receive an email from our team about your website.</div>
            <div className="text-xs pd-1 full">You can now close this page.</div>

         </>) : (formStage == onboardingFormConfig.length) ? (<>
            <div className="text-ml full bold-600">Review Form</div>
            <div className="text-xs pd-1 full">Have a look at your form before you make your submission</div>
            <Spacing size={1} />
            <ClientForm clientForm={clientForm} />
            <Spacing size={1} />
            <div className="box full dfb align-center gap-10" style={{ maxWidth: "450px" }}>
               <AwaitButton className="xxs pd-12 full" onClick={submitClientFormForReview}>
                  Submit for Review <ArrowRight size={17} />
               </AwaitButton>
            </div>
         </>) : (<>
            <div 
               className="box full pd-1 pdx-1"
               style={{
                  background: "#ffef95ff", color: "#664e00ff",
                  border: "1px solid #efcd00", borderRadius: "12px"
               }}
            >
               <div className="text-xxs dfb align-center gap-5 bold-600">
                  <TriangleAlert size={17} /> Please do not leave this page while filling this form.
               </div>
            </div>
            <Spacing size={1} />

            <div className="text-ml full bold-600">{onboardingFormConfig[formStage].title}</div>
            <div className="text-xs pd-1 full">{onboardingFormConfig[formStage].description}</div>
            <Spacing size={1} />

            {onboardingFormConfig[formStage].formContent.map((formItem, index) => {
               switch (formItem.type) {
                  case "text":
                     return <div className="box full mb-4" key={index}>
                        <div className="text-sm bold-500 full mb-05">
                           {formItem.title} {formItem.notRequired ? '(Optional)' : <Asterisk size={20} color='#ff0000' />}   
                        </div>
                        <div className="text-xs full mb-05">{formItem.description}</div>
                        <div className="box full pd-05">
                           <input 
                              type="text" key={formItem.id}
                              className="xxs pd-12 pdx-2 full"
                              placeholder={formItem.placeholder}
                              id={formItem.id} name={formItem.id}
                              defaultValue={(clientForm as any)[onboardingFormConfig[formStage].id][formItem.id] || ''}
                              onChange={e => updateClientForm(formItem, e.target.value)}
                           />
                        </div>
                     </div>
                     
                  case "select":
                     return <div className="box full mb-4" key={index}>
                        <div className="text-sm bold-500 full mb-05">
                           {formItem.title} {formItem.notRequired ? '(Optional)' : <Asterisk size={20} color='#ff0000' />}   
                        </div>
                        <div className="text-xs full mb-05">{formItem.description}</div>
                        <div className="box full pd-05">
                           <Select
                              options={[ formItem.placeholder, ...formItem.value as string[] ]}
                              onSelect={option => { updateClientForm(formItem, (option == formItem.placeholder) ? undefined : option); }}
                              style={{ width: "100%", maxWidth: "400px" }}
                              selectedOptionStyle={{ padding: "12px 0" }}
                              defaultOptionIndex={
                                 (clientForm as any)[onboardingFormConfig[formStage].id][formItem.id] !== ''
                                 ? [ formItem.placeholder, ...formItem.value as string[] ].indexOf((clientForm as any)[onboardingFormConfig[formStage].id][formItem.id])
                                 : 0   
                              }
                           />
                        </div>
                     </div>
                     
                  case "number":
                     return <div className="box full mb-4" key={index}>
                        <div className="text-sm bold-500 full mb-05">
                           {formItem.title} {formItem.notRequired ? '(Optional)' : <Asterisk size={20} color='#ff0000' />}   
                        </div>
                        <div className="text-xs full mb-05">{formItem.description}</div>
                        <div className="box full pd-05">
                           <input 
                              type="number" key={formItem.id}
                              className="xxs pd-12 pdx-2 full"
                              placeholder={formItem.placeholder}
                              id={formItem.id} name={formItem.id}
                              defaultValue={(clientForm as any)[onboardingFormConfig[formStage].id][formItem.id] || ''}
                              onChange={e => updateClientForm(formItem, parseInt(e.target.value) || 0)}
                           />
                        </div>
                     </div>
                     
                  case "email":
                     return <div className="box full mb-4" key={index}>
                        <div className="text-sm bold-500 full mb-05">
                           {formItem.title} {formItem.notRequired ? '(Optional)' : <Asterisk size={20} color='#ff0000' />}   
                        </div>
                        <div className="text-xs full mb-05">{formItem.description}</div>
                        <div className="box full pd-05">
                           <input 
                              type="email" key={formItem.id}
                              className="xxs pd-12 pdx-2 full"
                              placeholder={formItem.placeholder}
                              id={formItem.id} name={formItem.id}
                              defaultValue={(clientForm as any)[onboardingFormConfig[formStage].id][formItem.id] || ''}
                              onChange={e => updateClientForm(formItem, e.target.value)}
                           />
                        </div>
                     </div>
                     
                  case "textarea":
                     return <div className="box full mb-4" key={index}>
                        <div className="text-sm bold-500 full mb-05">
                           {formItem.title} {formItem.notRequired ? '(Optional)' : <Asterisk size={20} color='#ff0000' />}   
                        </div>
                        <div className="text-xs full mb-05">{formItem.description}</div>
                        <div className="box full pd-05">
                           <textarea 
                              className="xxs pd-12 pdx-2 full h-20" key={formItem.id}
                              placeholder={formItem.placeholder}
                              id={formItem.id} name={formItem.id}
                              defaultValue={(clientForm as any)[onboardingFormConfig[formStage].id][formItem.id] || ''}
                              style={{ borderRadius: "12px" }}
                              onChange={e => updateClientForm(formItem, e.target.value)}
                           />
                        </div>
                     </div>
                     
                  case "date":
                     return <div className="box full mb-4" key={index}>
                        <div className="text-sm bold-500 full mb-05">
                           {formItem.title} {formItem.notRequired ? '(Optional)' : <Asterisk size={20} color='#ff0000' />}   
                        </div>
                        <div className="text-xs full mb-05">{formItem.description}</div>
                        <div className="box full pd-05">
                           <DateTimeSelector
                              onSelect={ms => updateClientForm(formItem, ms)}
                              defaultTime={(clientForm as any)[onboardingFormConfig[formStage].id][formItem.id]}
                           />
                        </div>
                     </div>
                     
                  case "multipleChoices":
                     return <div className="box full mb-4" key={index}>
                        <div className="text-sm bold-500 full mb-05">
                           {formItem.title} {formItem.notRequired ? '(Optional)' : <Asterisk size={20} color='#ff0000' />}   
                        </div>
                        <div className="text-xs full mb-05">{formItem.description}</div>
                        <div className="box full pd-05">
                           <Selections 
                              selections={formItem.value as string[]}
                              onSelect={options => updateClientForm(formItem, options.map(o => (formItem.value as any)[o]))}
                              defaultSelectionIndexes={
                                 (clientForm as any)[onboardingFormConfig[formStage].id][formItem.id]
                                 ? (clientForm as any)[onboardingFormConfig[formStage].id][formItem.id].map((i: any) => (formItem.value as string[]).indexOf(i)!)
                                 : []
                              }
                           />
                        </div>
                     </div>
                     
                  case "checkbox":
                     return <div className="box full mb-4" key={index}>
                        <div className="text-sm bold-500 full mb-05">
                           {formItem.title} {formItem.notRequired ? '(Optional)' : <Asterisk size={20} color='#ff0000' />}   
                        </div>
                        <div className="box full">
                           <Checkbox 
                              label={formItem.description!}
                              defaultChecked={(clientForm as any)[onboardingFormConfig[formStage].id][formItem.id]!}
                              onChange={checked => updateClientForm(formItem, checked)}
                           />
                        </div>
                     </div>
                     
                  case "colours":
                     return <div className="box full mb-4" key={index}>
                        <div className="text-sm bold-500 full mb-05">
                           {formItem.title} {formItem.notRequired ? '(Optional)' : <Asterisk size={20} color='#ff0000' />}   
                        </div>
                        <div className="text-xs full mb-05">{formItem.description}</div>
                        <div className="box full pd-05">
                           <MultipleColorChooser 
                              onChange={colours => updateClientForm(formItem, colours)}
                              defaultColours={(clientForm as any)[onboardingFormConfig[formStage].id][formItem.id]}
                           />
                        </div>
                     </div>
                     
                  case "image":
                     return <div className="box full mb-4" key={index}>
                        <div className="text-sm bold-500 full mb-05">
                           {formItem.title} {formItem.notRequired ? '(Optional)' : <Asterisk size={20} color='#ff0000' />}   
                        </div>
                        <div className="text-xs full mb-05">{formItem.description}</div>
                        <div className="box full pd-05">
                           <LogoSelector onChange={image => updateClientForm(formItem, image)} defaultImage={(clientForm as any)[onboardingFormConfig[formStage].id][formItem.id]} />
                        </div>
                     </div>
               }
            })}

            <Spacing size={1} />

            <div className="box full dfb align-center gap-10" style={{ maxWidth: "450px" }}>
               {(formStage > 0) && (<button className="xxs pd-12 full outline-black tiny-shadow" onClick={() => setFormStage(p => p-1)}>
                  <ArrowLeft size={17} /> Previous
               </button>)}
               <button className="xxs pd-12 full" onClick={nextButton}>
                  {(formStage == onboardingFormConfig.length-1) ? 'Review Form' : 'Next'} <ArrowRight size={17} />
               </button>
            </div>
         </>)}

         <Spacing size={3} />
      </OnboardingWrapper>
   )
}
