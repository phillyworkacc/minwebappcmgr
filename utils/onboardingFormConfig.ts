export const onboardingFormConfig: OnboardingForm = [
   {
      id: "niche",
      title: "Choose your Niche",
      formContent: [
         {
            id: "niche",
            title: "Niche",
            type: "select",
            placeholder: "Choose Niche",
            value: ["Clothing Brand", "Reseller", "E-Commerce", "Service Business", "Personal Brand", "Saas"]
         }
      ]
   },
   {
      id: "your_information",
      title: "Your Information",
      formContent: [
         {
            id: "first_name",
            title: "First Name",
            type: "text",
            placeholder: "Enter your First Name",
            value: ""
         },
         {
            id: "last_name",
            title: "Last Name",
            type: "text",
            placeholder: "Enter your Last Name",
            value: ""
         },
         {
            id: "email",
            title: "Email",
            type: "email",
            placeholder: "Enter your Email",
            value: ""
         },
         {
            id: "phone",
            title: "Phone Number",
            type: "text",
            placeholder: "Enter your Phone Number",
            value: ""
         },
         {
            id: "preferred_contact",
            title: "Preferred Contact Method",
            type: "select",
            placeholder: "Choose your Preferred Contact Method",
            value: ["Email", "Phone Number"]
         },
         {
            id: "profile_image",
            title: "Profile Picture",
            type: "image",
            placeholder: "Enter your Phone Number",
            value: "",
            notRequired: true
         },
      ]
   },
   {
      id: "business_information",
      title: "Business Information",
      formContent: [
         {
            id: "business_name",
            title: "Business Name",
            type: "text",
            placeholder: "Enter your Business Name",
            value: ""
         },
         {
            id: "email",
            title: "Business Email",
            type: "email",
            placeholder: "Enter your Business Contact Email",
            value: ""
         },
         {
            id: "phone",
            title: "Business Phone Number",
            type: "text",
            placeholder: "Enter your Business Phone Number",
            value: ""
         }
      ]
   },
   {
      id: "website_information",
      title: "Website Information",
      formContent: [
         {
            id: "current_website",
            title: "Current Website URL",
            type: "text",
            placeholder: "Enter your Current Website URL",
            value: "",
            notRequired: true
         },
         {
            id: "current_website_dislikes",
            title: "What do you dislike about your current website ?",
            type: "textarea",
            placeholder: "Enter your dislikes",
            value: "",
            notRequired: true
         },
         {
            id: "new_website_purpose",
            title: "What do you want in the new website ?",
            type: "textarea",
            placeholder: "Purpose of the new website",
            value: ""
         },
         {
            id: "required_pages",
            title: "What pages do you require on this new website ?",
            type: "multipleChoices",
            placeholder: "",
            value: ["Home", "About", "Services", "Contact", "Team", "Reviews"]
         },
      ]
   },
   {
      id: "branding_assets",
      title: "Branding Assets",
      formContent: [
         {
            id: "logo",
            title: "Business Logo",
            type: "image",
            placeholder: "Choose your Business Logo",
            value: ""
         },
         {
            id: "colours",
            title: "Brand Colours",
            description: "Leave this blank if you want us to choose colours for you",
            type: "colours",
            placeholder: "Enter Hex Codes",
            value: "",
            notRequired: true
         },
         {
            id: "fonts",
            title: "Brand Font",
            description: "Leave this blank if you want us to choose a font for you",
            type: "text",
            placeholder: "Enter The Font Name",
            value: "",
            notRequired: true
         },
      ]
   },
   {
      id: "social_media",
      title: "Social Media",
      description: "Fill in all the links to your social media accounts",
      formContent: [
         {
            id: "show_social_media",
            title: "Show Social Media Platforms on Website",
            type: "checkbox",
            description: "Allowing this means your social media platforms will be visible on your website",
            placeholder: "",
            value: ""
         },
         {
            id: "instagram",
            title: "Instagram",
            type: "text",
            placeholder: "Enter your Instagram Handle",
            value: "",
            notRequired: true
         },
         {
            id: "facebook",
            title: "Facebook",
            type: "text",
            placeholder: "Enter your Facebook Handle",
            value: "",
            notRequired: true
         },
         {
            id: "linkedin",
            title: "LinkedIn",
            type: "text",
            placeholder: "Enter your LinkedIn Handle",
            value: "",
            notRequired: true
         },
         {
            id: "tiktok",
            title: "TikTok",
            type: "text",
            placeholder: "Enter your TikTok Handle",
            value: "",
            notRequired: true
         },
         {
            id: "youtube",
            title: "YouTube",
            type: "text",
            placeholder: "Enter your YouTube Channel Link",
            value: "",
            notRequired: true
         },
      ]
   },
   {
      id: "website_delivery",
      title: "Website Delivery",
      description: "Deadline dates and Meeting Dates",
      formContent: [
         {
            id: "meeting_date",
            title: "Meeting Date",
            type: "date",
            description: "When are you available to meet to discuss the development of your website ?",
            placeholder: "",
            value: ""
         },
         {
            id: "delivery_date",
            title: "Delivery Date",
            type: "date",
            description: "When do you want the website to be ready ?",
            placeholder: "",
            value: ""
         },
      ]
   },
]