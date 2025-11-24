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
   dueDate: string;
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