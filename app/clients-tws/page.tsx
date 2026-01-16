import { dalDbOperation, dalRequireAuth, dalRequireAuthRedirect } from "@/dal/helpers"
import { db } from "@/db";
import { clientsTable } from "@/db/schemas";
import { and, desc, eq } from "drizzle-orm";
import ClientsPage from "./ClientsPage";
import LoadingPage from "../loading";


export async function generateMetadata() {
   return {
      title: `Minweb - Clients for Template Website System Build`
   };
}

export default async function Clients () {
   await dalRequireAuthRedirect();

   // const allTWSClients = await dalRequireAuth(user =>
   //    dalDbOperation(async () => {
   //       const websiteBuildType = "tws-build"
   //       const result = await db
   //          .select()
   //          .from(clientsTable)
   //          .orderBy(desc(clientsTable.createdat))
   //          .where(and(
   //             eq(clientsTable.userid, user.userid!),
   //             eq(clientsTable.websiteBuildType, websiteBuildType)
   //          ));

   //       return result;
   //    })
   // )

   // if (allTWSClients.success) {
   //    return <ClientsPage allClients={JSON.parse(JSON.stringify(allTWSClients.data))} />
   // } else {
   //    return <LoadingPage />;
   // }

   const allTWSClients: Client[] = [
   {
      id: 1,
      userid: "",
      clientid: "",
      name: "Joe Turner",
      email: "joe@joesplumbing.co.uk",
      websiteBuildType: "tws-build",
      phoneNumber: "+447911000001",
      twilioPhoneNumber: "",
      description: "Emergency and residential plumbing services.",
      businessName: "Joe's Plumbing",
      image: "https://picsum.photos/id/1011/400/400",
      notes: "",
      status: "working",
      websites: "",
      review: "",
      latestupdate: Date.now().toString(),
      createdat: Date.now().toString()
   },
   {
      id: 2,
      userid: "",
      clientid: "",
      name: "Sarah Green",
      email: "contact@greenleaflandscaping.co.uk",
      websiteBuildType: "tws-build",
      phoneNumber: "+447911000002",
      twilioPhoneNumber: "",
      description: "Garden design and maintenance specialists.",
      businessName: "GreenLeaf Landscaping",
      image: "https://picsum.photos/id/1025/400/400",
      notes: "",
      status: "working",
      websites: "",
      review: "",
      latestupdate: Date.now().toString(),
      createdat: Date.now().toString()
   },
   {
      id: 3,
      userid: "",
      clientid: "",
      name: "Mark Lewis",
      email: "info@brightsparkelectrical.co.uk",
      websiteBuildType: "tws-build",
      phoneNumber: "+447911000003",
      twilioPhoneNumber: "",
      description: "Certified domestic and commercial electricians.",
      businessName: "BrightSpark Electrical",
      image: "https://picsum.photos/id/1035/400/400",
      notes: "",
      status: "working",
      websites: "",
      review: "",
      latestupdate: Date.now().toString(),
      createdat: Date.now().toString()
   },
   {
      id: 4,
      userid: "",
      clientid: "",
      name: "Tom Harris",
      email: "support@rapidroofrepairs.co.uk",
      websiteBuildType: "tws-build",
      phoneNumber: "+447911000004",
      twilioPhoneNumber: "",
      description: "Fast-response roof repair specialists.",
      businessName: "Rapid Roof Repairs",
      image: "https://picsum.photos/id/1040/400/400",
      notes: "",
      status: "working",
      websites: "",
      review: "",
      latestupdate: Date.now().toString(),
      createdat: Date.now().toString()
   },
   {
      id: 5,
      userid: "",
      clientid: "",
      name: "James Patel",
      email: "hello@primedriveways.co.uk",
      websiteBuildType: "tws-build",
      phoneNumber: "+447911000005",
      twilioPhoneNumber: "",
      description: "Driveway installation and resurfacing.",
      businessName: "Prime Driveways",
      image: "https://picsum.photos/id/1050/400/400",
      notes: "",
      status: "working",
      websites: "",
      review: "",
      latestupdate: Date.now().toString(),
      createdat: Date.now().toString()
   },
   {
      id: 6,
      userid: "",
      clientid: "",
      name: "Luke Adams",
      email: "info@clearflowdrainage.co.uk",
      websiteBuildType: "tws-build",
      phoneNumber: "+447911000006",
      twilioPhoneNumber: "",
      description: "Blocked drains and emergency callouts.",
      businessName: "ClearFlow Drainage",
      image: "https://picsum.photos/id/1062/400/400",
      notes: "",
      status: "working",
      websites: "",
      review: "",
      latestupdate: Date.now().toString(),
      createdat: Date.now().toString()
   },
   {
      id: 7,
      userid: "",
      clientid: "",
      name: "Emma Collins",
      email: "contact@elitekitchens.co.uk",
      websiteBuildType: "tws-build",
      phoneNumber: "+447911000007",
      twilioPhoneNumber: "",
      description: "Custom kitchen and bathroom renovations.",
      businessName: "Elite Kitchens & Baths",
      image: "https://picsum.photos/id/1074/400/400",
      notes: "",
      status: "working",
      websites: "",
      review: "",
      latestupdate: Date.now().toString(),
      createdat: Date.now().toString()
   },
   {
      id: 8,
      userid: "",
      clientid: "",
      name: "Ben Wright",
      email: "support@swiftpestcontrol.co.uk",
      websiteBuildType: "tws-build",
      phoneNumber: "+447911000008",
      twilioPhoneNumber: "",
      description: "Residential and commercial pest control.",
      businessName: "Swift Pest Control",
      image: "https://picsum.photos/id/1084/400/400",
      notes: "",
      status: "working",
      websites: "",
      review: "",
      latestupdate: Date.now().toString(),
      createdat: Date.now().toString()
   },
   {
      id: 9,
      userid: "",
      clientid: "",
      name: "Oliver Brown",
      email: "info@northsidebuilders.co.uk",
      websiteBuildType: "tws-build",
      phoneNumber: "+447911000009",
      twilioPhoneNumber: "",
      description: "General building and home extensions.",
      businessName: "Northside Builders",
      image: "https://picsum.photos/id/109/400/400",
      notes: "",
      status: "working",
      websites: "",
      review: "",
      latestupdate: Date.now().toString(),
      createdat: Date.now().toString()
   },
   {
      id: 10,
      userid: "",
      clientid: "",
      name: "Daniel Foster",
      email: "hello@pureheatgas.co.uk",
      websiteBuildType: "tws-build",
      phoneNumber: "+447911000010",
      twilioPhoneNumber: "",
      description: "Gas boiler installation and servicing.",
      businessName: "PureHeat Gas Services",
      image: "https://picsum.photos/id/110/400/400",
      notes: "",
      status: "working",
      websites: "",
      review: "",
      latestupdate: Date.now().toString(),
      createdat: Date.now().toString()
   }
   ];

   return <ClientsPage allClients={JSON.parse(JSON.stringify(allTWSClients))} />

}
