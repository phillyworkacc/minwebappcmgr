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
   latestupdate: string;
}

type ClientChartInfo = Client & {
   amountPaid: number;
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