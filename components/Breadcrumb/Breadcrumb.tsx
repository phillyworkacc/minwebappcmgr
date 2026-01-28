'use client'
import { useRouter } from "next/navigation";

type BreadcrumbProps = {
   pages: {
      href: string;
      label: string;
   }[]
   hideDashboardLink?: boolean;
}

export default function Breadcrumb({ pages, hideDashboardLink }: BreadcrumbProps) {
   const router = useRouter();

   return (
      <div className="box full dfb align-center gap-10">
         {(!hideDashboardLink) && (<div className="box fit dfb align-center gap-10">
            <div className="text-xxs visible-link" onClick={() => router.push('/')}>Dashboard</div>
            <div className="text-xxs">/</div>
         </div>)}
         {pages.map((page, index) => (
            <div className="box fit dfb align-center gap-10" key={index}>
               <div 
                  className={`text-xxs whitespace-nowrap ${(index == (pages.length-1)) ? 'bold-600 accent-color' : 'visible-link'}`}
                  onClick={() => { if (index !== (pages.length-1)) router.push(page.href); }}
               >{page.label}</div>
               {(index !== (pages.length-1)) && (<div className="text-xxs">/</div>)}
            </div>
         ))}
      </div>
   )
}
