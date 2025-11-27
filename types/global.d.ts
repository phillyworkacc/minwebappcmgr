declare module "*.css"

type User = {
   id: number;
   userid: string;
   name: string;
   email: string;
   password: string;
}

type ClientStatus = 'working' | 'finished' | 'beginning' | 'failed'
type Client = {
   id: number;
   userid: string;
   clientid: string;
   name: string;
   email: string;
   description: string;
   image: string;
   notes: string;
   status: ClientStatus;
   review: string;
   createdat: string;
   websites: string;
   latestupdate: string;
}

type ClientChartInfo = Client & {
   amountPaid: number;
}

type ClientProfile = Client & {
   allWebsites: Website[];
}

type Payment = {
   id: number;
   userid: string;
   clientid: string;
   amount: string;
   text: string;
   date: string;
}

type ClientPayment = {
   client: {
      clientid: string;
      name: string;
      image: string;
   },
   amount: string;
   text: string;
   date: string;
}

type ClientReview = {
   client: {
      clientid: string;
      name: string;
      image: string;
   };
   review: string;
}

type ActivityPriority = 'high' | 'medium' | 'low'
type Activity = {
   id: number;
   activityId: string;
   userid: string;
   clientid: string;
   title: string;
   priority: ActivityPriority;
   markdownDescriptionText: string;
   completed: boolean;
   completeDate: string;
   dueDate: number;
   notified: boolean;
   date: string;
}

type ActivityClient = Activity & {
   client: Client;
}

type Website = {
   id: number;
   userid: string;
   clientid: string;
   websiteid: string;
   url: string;
   date: string;
}

type ClientFormSubmission = {
   id: number;
   clientFormId: string;
   clientFormJson: string;
   date: number;
}

type FormValueItem = {
   text: string;
   email: string;
   textarea: string;
   number: number;
   select: string[];
   colours: string;
   multipleChoices: string[];
   checkbox: boolean;
   image: File;
   date: Date;
}

type FormItem<T extends keyof FormValueItem = keyof FormValueItem> = {
   id: string;
   title: string;
   description?: string;
   placeholder: string;
   type: T;
   value: FormValueItem[T];
   notRequired?: true;
}

type Form = {
   id: "niche" | "your_information" | "business_information" | "website_information" | "branding_assets" | "social_media" | "website_delivery";
   title: string;
   description?: string;
   formContent: FormItem[]
};
type OnboardingForm = Form[];
type ClientForm = {
   [K in Form["id"]]: any;
}