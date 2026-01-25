'use client'
import "./ConversationBox.css"
import { getInitialBgColor } from "@/utils/funcs"
import { formatMilliseconds } from "@/utils/date";
import { ChevronLeft, SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

export default function ConversationBox () {
   const [deviceType, setDeviceType] = useState<"desktop" | "mobile">("desktop");
   const mobileThreshold = 750;
   const [openedConversation, setOpenedConversation] = useState<string | null>(null);


   useEffect(() => {
      setDeviceType(window.innerWidth >= mobileThreshold ? 'desktop' : 'mobile');
      window.addEventListener('resize', () => setDeviceType(window.innerWidth >= mobileThreshold ? 'desktop' : 'mobile'));
   }, [])


   const messages = [
      {
         body: "Hey, are we still on for today?",
         date: 1705315200000,
         direction: "in",
      },
      {
         body: "Yeah, meeting at 3 works for me.",
         date: 1705316100000,
         direction: "out",
      },
      {
         body: "Perfect. I'll bring the docs.",
         date: 1705316700000,
         direction: "in",
      },
      {
         body: "Sounds good. See you then.",
         date: 1705317300000,
         direction: "out",
      },
      {
         body: "Running about 5 minutes late.",
         date: 1705317900000,
         direction: "in",
      },
      {
         body: "No worries, I'm here.",
         date: 1705318200000,
         direction: "out",
      }
   ];

   const contacts = [
      {
         name: "Alice Johnson",
         lastMessage: {
            body: "See you in a bit.",
            date: 1705318200000,
            direction: "in",
         },
      },
      {
         name: "Marcus Lee",
         lastMessage: {
            body: "I pushed the fix to main.",
            date: 1705309800000,
            direction: "out",
         },
      },
      {
         name: "Priya Patel",
         lastMessage: {
            body: "Can you review the PR later today?",
            date: 1705322400000,
            direction: "in",
         },
      },
      {
         name: "Daniel Martínez",
         lastMessage: {
            body: "Thanks for the help yesterday.",
            date: 1705243200000,
            direction: "in",
         },
      },
      {
         name: "Sofia Nguyen",
         lastMessage: {
            body: "Let’s sync tomorrow morning.",
            date: 1705330200000,
            direction: "out",
         },
      },
      {
         name: "Ethan Brown",
         lastMessage: {
            body: "On my way now.",
            date: 1705333800000,
            direction: "in",
         },
      }
   ];

   return (
      <div className="conversation-box">
         {(deviceType == "desktop" || (deviceType == "mobile" && openedConversation == null)) && (<div 
            className="contact-list"
            style={{
               maxWidth: (deviceType == "desktop") ? "300px" : "100%",
               borderRight: (deviceType == "desktop") ? "1px solid #ededed" : "none",
            }}
         >
            <div className="text-m full bold-600 pdx-1 mt-1 mb-05">Contacts</div>
            {contacts.map(contact => (
               <div 
                  key={contact.name.replaceAll(" ", "-").toLowerCase()}
                  className={`contact ${contact.name == openedConversation ? 'selected' : ''}`} 
                  onClick={() => setOpenedConversation(contact.name)}
               >
                  <div className="icon">
                     <div className="profile-icon" style={{
                        background: getInitialBgColor(contact.name).backgroundColor, 
                        color: getInitialBgColor(contact.name).textColor 
                     }}>{contact.name.substring(0,1).toUpperCase()}</div>
                  </div>
                  <div className="box full dfb column">
                     <div className="text-xs bold-600 full">{contact.name}</div>
                     <div className="text-xxxs grey-4 full">{contact.lastMessage.body.substring(0, 25)}{contact.lastMessage.body.length > 30 && '...'}</div>
                  </div>
               </div>
            ))}
         </div>)}
         {(deviceType == "desktop" || (deviceType == "mobile" && openedConversation !== null)) && (<div className="contact-messages">
            {(openedConversation == null) ? (<>
               <div className="box full h-full dfb align-center justify-center column gap-10">
                  <div className="text-ml bold-600 grey-4 full text-center">
                     No Conversation Selected
                  </div>
                  <div className="text-xxs grey-4 full text-center">
                     Choose a contact to start chatting
                  </div>
               </div>
            </>) : (<>            
               <div className="contact-info">
                  <div className="box fit h-full dfb align-center justify-center cursor-pointer" onClick={() => setOpenedConversation(null)}>
                     <ChevronLeft size={20} />
                  </div>
                  <div className="profile-icon" style={{
                     background: getInitialBgColor("Jake Parker").backgroundColor, 
                     color: getInitialBgColor("Jake Parker").textColor 
                  }}>J</div>
                  <div className="text-xs bold-600 fit">Jake Parker</div>
               </div>
               <div className="messages-container">
                  {messages.map(message => (
                     <div key={message.date} className={`message-${message.direction}`}>
                        <div className="message">{message.body}</div>
                        <div className="text-xt grey-4 fit pd-05">Sent at {formatMilliseconds(message.date, true, true)}</div>
                     </div>
                  ))}
               </div>
               <div className="send-message-container">
                  <input type="text" className="xxs pd-13 pdx-15 full" placeholder="Message" />
                  <button className="send-button">
                     <SendHorizontal size={17} />
                  </button>
               </div>
            </>)}
         </div>)}
      </div>
   )
}
