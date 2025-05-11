type ColorTheme = 'dark' | 'light'
type User = {
   userid: string;
   name: string;
   email: string;
   password: string;
   color_theme: ColorTheme;
}

type ClientStatus = 'working' | 'finished' | 'beginning' | 'failed'
type Client = {
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

type DeviceType = 'Desktop' | 'Mobile'
type UserTrackingDataPage = 'Minweb' | 'Detix'
type OS = 'Windows' | 'iOS' | 'macOS' | 'Android' | 'Linux' | 'Unknown'
type UserTrackingData = {
   location: string;
   time: number;
   utmsource: string;
   device: DeviceType;
   os: OS;
   page: UserTrackingDataPage;
}
type UserTrackingDataPartial = Partial<UserTrackingData>


type Payment = {
   userid: string;
   clientid: string;
   amount: string;
   text: string;
   date: string;
}