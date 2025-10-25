type ChartMonthlyData = {
   year: number;
   month: string;
   totalAmount: number;
   totalPayments: number;
   clients: ClientChartInfo[];
};

function convertClientsToClientChartInfo (clients: ClientChartInfo[]) {
   const clientChartInfos: ClientChartInfo[] = [];
   for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      if (clientChartInfos.find(c => (c.clientid == client.clientid))) {
         clientChartInfos[
            clientChartInfos.indexOf(clientChartInfos.find(c => (c.clientid == client.clientid))!)
         ].amountPaid += client.amountPaid;
      } else {
         clientChartInfos.push(client);
      }
   }
   return clientChartInfos;
}

export function chartGroupByMonth (data: Payment[], clients: Client[], targetYear: number): ChartMonthlyData[] {
   const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
   ];

   const grouped: { [key: number]: { [key: string]: { totalAmount: number; totalPayments: number; clients: ClientChartInfo[] } } } = {};

   // Get the current date for determining the current month and year
   const currentDate = new Date();
   const currentYear = currentDate.getFullYear();
   const currentMonthIndex = currentDate.getMonth(); // 0-based (0 = Jan, 11 = Dec)

   // Set initial amount for each month and year as 0
   data.forEach(({ amount, date, clientid }) => {
      const dateObj = new Date(parseInt(date));
      const year = dateObj.getFullYear();
      const month = months[dateObj.getMonth()]; // Get the 3-letter month name (Jan, Feb, etc.)

      // Only process data for the target year
      if (year === targetYear) {
         if (!grouped[year]) {
            grouped[year] = {};
            months.forEach(monthName => {
               grouped[year][monthName] = {
                  totalAmount: 0,
                  totalPayments: 0,
                  clients: []
               }; // Initialize each month with 0
            });
         }
         grouped[year][month].totalPayments += 1
         grouped[year][month].totalAmount += parseFloat(amount); // Add the amount to the corresponding month of the year
         grouped[year][month].clients.push({
            ...clients.find(c => (c.clientid == clientid))!,
            amountPaid: parseFloat(amount)
         })
      }
   });

   // Return the result for the specified year
   const result: ChartMonthlyData[] = [];

   // If the year exists, format the result for the required months
   if (grouped[targetYear]) {
      const monthsData = grouped[targetYear];

      // If we're in the current year, stop at the current month
      const lastMonthToShow = targetYear === currentYear ? currentMonthIndex : 11;

      months.slice(0, lastMonthToShow + 1).forEach(month => {
         result.push({
            year: targetYear,
            month,
            totalPayments: monthsData[month].totalPayments,
            totalAmount: monthsData[month].totalAmount,
            clients: convertClientsToClientChartInfo(monthsData[month].clients)
         });
      });
   }

   return result;
}

type ChartPastDaysData = {
   date: string;
   totalAmount: number;
   totalPayments: number;
   clients: ClientChartInfo[];
}

export function chartLast30Days(data: Payment[], clients: Client[]): ChartPastDaysData[] {
   const now = Date.now();
   const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

   // Generate the last 7 days
   const last30Days: string[] = [];
   for (let i = 0; i < 30; i++) {
      const day = new Date(now - i * 24 * 60 * 60 * 1000);
      const shortDate = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      last30Days.push(shortDate);
   }

   // Group the data by date
   const groupedByDate: { [key: string]: number } = {};
   const clientsGroupedByDate: { [key: string]: number } = {};
   const actualClientsGroupedByDate: { [key: string]: ClientChartInfo[] } = {};
   data.forEach(({ amount, date, clientid }) => {
      const dateStr = new Date(parseInt(date)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (parseInt(date) >= thirtyDaysAgo) {
         if (!groupedByDate[dateStr]) groupedByDate[dateStr] = 0;
         if (!clientsGroupedByDate[dateStr]) clientsGroupedByDate[dateStr] = 0;
         if (!actualClientsGroupedByDate[dateStr]) actualClientsGroupedByDate[dateStr] = [];
         clientsGroupedByDate[dateStr] += 1;
         groupedByDate[dateStr] += parseFloat(amount);
         actualClientsGroupedByDate[dateStr].push({
            ...clients.find(c => (c.clientid == clientid))!,
            amountPaid: parseFloat(amount)
         })
      }
   });

   // Create the result array
   const result = last30Days.map(date => ({
      date,
      totalPayments: clientsGroupedByDate[date] || 0,
      totalAmount: groupedByDate[date] || 0, // If no data for the date, set totalAmount to 0
      clients: actualClientsGroupedByDate[date] ? convertClientsToClientChartInfo(actualClientsGroupedByDate[date]) : []
   }));

   return result.toReversed();
}

export function chartLast7Days(data: Payment[], clients: Client[]): ChartPastDaysData[] {
   const now = Date.now();
   const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

   // Generate the last 7 days
   const last7Days: string[] = [];
   for (let i = 0; i < 7; i++) {
      const day = new Date(now - i * 24 * 60 * 60 * 1000);
      const shortDate = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      last7Days.push(shortDate);
   }

   // Group the data by date
   const groupedByDate: { [key: string]: number } = {};
   const clientsGroupedByDate: { [key: string]: number } = {};
   const actualClientsGroupedByDate: { [key: string]: ClientChartInfo[] } = {};
   data.forEach(({ amount, date, clientid }) => {
      const dateStr = new Date(parseInt(date)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (parseInt(date) >= sevenDaysAgo) {
         if (!groupedByDate[dateStr]) groupedByDate[dateStr] = 0;
         if (!clientsGroupedByDate[dateStr]) clientsGroupedByDate[dateStr] = 0;
         if (!actualClientsGroupedByDate[dateStr]) actualClientsGroupedByDate[dateStr] = [];
         clientsGroupedByDate[dateStr] += 1;
         groupedByDate[dateStr] += parseFloat(amount);
         actualClientsGroupedByDate[dateStr].push({
            ...clients.find(c => (c.clientid == clientid))!,
            amountPaid: parseFloat(amount)
         })
      }
   });

   // Create the result array
   const result = last7Days.map(date => ({
      date,
      totalPayments: clientsGroupedByDate[date] || 0,
      totalAmount: groupedByDate[date] || 0, // If no data for the date, set totalAmount to 0
      clients: actualClientsGroupedByDate[date] ? convertClientsToClientChartInfo(actualClientsGroupedByDate[date]) : []
   }));

   return result.toReversed();
}

type ChartCurrentMonthData = {
   day: string;
   totalAmount: number;
   totalPayments: number;
   clients: ClientChartInfo[];
}
export function chartCurrentMonth(data: Payment[], clients: Client[]): ChartCurrentMonthData[] {
   const currentDate = new Date();
   const currentYear = currentDate.getFullYear();
   const currentMonthIndex = currentDate.getMonth(); // 0-based (0 = Jan, 11 = Dec)
   const currentMonth = currentDate.toLocaleString('default', { month: 'short' }); // Short month name (e.g., "May")

   // Calculate the number of days in the current month
   const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

   // Initialize an array with 0s for each day of the month
   const dailyAmounts = Array.from({ length: daysInMonth }, (_, i) => ({
      day: `${currentMonth} ${i + 1}`, // Format the day as "May 1", "May 2", etc.
      totalPayments: 0,
      totalAmount: 0,
      clients: []
   } as ChartCurrentMonthData));

   // Sum up the amounts for each day
   data.forEach(({ amount, date, clientid }) => {
      const dateObj = new Date(parseInt(date));
      const year = dateObj.getFullYear();
      const monthIndex = dateObj.getMonth(); // 0-based month index
      const day = dateObj.getDate(); // 1-based day of the month

      // Check if the date is in the current month and year
      if (monthIndex === currentMonthIndex && year === currentYear) {
         dailyAmounts[day - 1].totalPayments += 1;
         dailyAmounts[day - 1].totalAmount += parseFloat(amount); // Add the amount to the corresponding day
         dailyAmounts[day - 1].clients.push({
            ...clients.find(c => (c.clientid == clientid))!,
            amountPaid: parseFloat(amount)
         })
         dailyAmounts[day - 1].clients = convertClientsToClientChartInfo(dailyAmounts[day - 1].clients)
      }
   });

   return dailyAmounts;
}

export function getUniqueYears(data: Payment[] | ClientPayment[]): string[] {
   const years = data.map(item => {
      const date = new Date(parseInt(item.date));
      return date.getFullYear().toString();
   });

   // Filter out duplicates and return the unique years
   return [...new Set(years)];
}

export function getUniqueYearsClient (data: Client[]): string[] {
   const years = data.map(item => {
      const date = new Date(parseInt(item.createdat));
      return date.getFullYear().toString();
   });

   // Filter out duplicates and return the unique years
   return [...new Set(years)];
}

type ChartHourlyData = {
   hour: string;
   totalAmount: number;
   totalPayments: number;
   clients: ClientChartInfo[];
}

export function chartTodayHourly(data: Payment[], clients: Client[]): ChartHourlyData[] {
   const now = new Date();
   const currentYear = now.getFullYear();
   const currentMonth = now.getMonth();
   const currentDay = now.getDate();

   // Initialize 24 hours with 0 users
   const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const period = hour >= 12 ? 'pm' : 'am';
      const hour12 = hour % 12 === 0 ? 12 : hour % 12; // Convert to 12-hour format
      return {
         hour: `${hour12}${period}`, // e.g. "1am", "12pm"
         totalPayments: 0,
         totalAmount: 0,
         clients: []
      } as ChartHourlyData;
   });

   // Count users per hour for today
   data.forEach(({ amount, date, clientid }) => {
      const dateObj = new Date(parseInt(date));
      if (
         dateObj.getFullYear() === currentYear &&
         dateObj.getMonth() === currentMonth &&
         dateObj.getDate() === currentDay
      ) {
         const hour = dateObj.getHours();
         hourlyData[hour].totalAmount += parseFloat(amount);
         hourlyData[hour].totalPayments += 1;
         hourlyData[hour].clients.push({
            ...clients.find(c => (c.clientid == clientid))!,
            amountPaid: parseFloat(amount)
         })
         hourlyData[hour].clients = convertClientsToClientChartInfo(hourlyData[hour].clients)
      }
   });

   return hourlyData;
}