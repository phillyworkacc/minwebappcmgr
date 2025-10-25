'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb"
import VisibleMetrics from "./VisibleMetrics"
import CalculatedMetrics from "./CalculatedMetrics"
import Spacing from "@/components/Spacing/Spacing"

type RevenuePageProps = {
   clients: Client[];
   payments: Payment[];
}

export default function RevenuePage ({ clients, payments }: RevenuePageProps) {
   return (
      <AppWrapper>
         <Breadcrumb 
            pages={[
               { href: "/", label: "Revenue Insights" }
            ]}
         />

         <div className="box full dfb column mt-15">
            <div className="text-m full bold-600">Revenue Insights</div>
            <div className="text-xxs full grey-5 pd-05">See metrics on your revenue on Minweb</div>
         </div>

         <div className="box full dfb column mt-15">
            <div className="text-sm full bold-600 pd-1">Visible Metrics</div>
            <VisibleMetrics clients={clients} payments={payments} />
         </div>

         <div className="box full dfb column mt-3">
            <div className="text-sm full bold-600 pd-1">Calculated and Deeper Metrics</div>
            <CalculatedMetrics clients={clients} payments={payments} />
         </div>

         <Spacing size={4} />
      </AppWrapper>
   )
}
