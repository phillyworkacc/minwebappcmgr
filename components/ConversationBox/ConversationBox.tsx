'use client'
import "./ConversationBox.css"
import { getInitialBgColor } from "@/utils/funcs"
import { formatMilliseconds } from "@/utils/date";
import { ChevronLeft, SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { getConversationMessages } from "@/app/actions/conversations";
import { toast } from "sonner";
import Spacing from "../Spacing/Spacing";
import LoadingCard from "../Card/LoadingCard";

type ConversationBoxProps = {
   conversations: ConversationList[];
}

export default function ConversationBox ({ conversations }: ConversationBoxProps) {
   const [deviceType, setDeviceType] = useState<"desktop" | "mobile">("desktop");
   const mobileThreshold = 750;

   const [openedConversation, setOpenedConversation] = useState<string | null>(null);
   const [selectedConversation, setSelectedConversation] = useState<ConversationList | null>(null);

   const [messages, setMessages] = useState<Message[] | 'loading'>('loading');

   const selectConversation = async (conversation: ConversationList) => {
      setOpenedConversation(conversation.conversationId);
      setSelectedConversation(conversation);
      const conversationMessages: any = await getConversationMessages(conversation.conversationId);
      if (conversationMessages == false) {
         toast.error("Failed to load messages");
      } else {
         setMessages(conversationMessages);
      }
   }

   useEffect(() => {
      setDeviceType(window.innerWidth >= mobileThreshold ? 'desktop' : 'mobile');
      window.addEventListener('resize', () => setDeviceType(window.innerWidth >= mobileThreshold ? 'desktop' : 'mobile'));
   }, []);

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
            {conversations.length == 0 && (<>
               <div className="text-xxs full grey-4 pdx-1">No Contacts</div>
            </>)}
            {conversations.map(contact => (
               <div 
                  key={contact.customerName.replaceAll(" ", "-").toLowerCase()}
                  className={`contact ${contact.conversationId == openedConversation ? 'selected' : ''}`} 
                  onClick={() => selectConversation(contact)}
               >
                  <div className="icon">
                     <div className="profile-icon" style={{
                        background: getInitialBgColor(contact.customerName).backgroundColor, 
                        color: getInitialBgColor(contact.customerName).textColor 
                     }}>{contact.customerName.substring(0,1).toUpperCase()}</div>
                  </div>
                  <div className="box full dfb column">
                     <div className="text-xs bold-600 full">{contact.customerName}</div>
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
                     background: getInitialBgColor(selectedConversation?.customerName!).backgroundColor, 
                     color: getInitialBgColor(selectedConversation?.customerName!).textColor 
                  }}>{selectedConversation?.customerName![0].toUpperCase()}</div>
                  <div className="text-xs bold-600 fit">{selectedConversation?.customerName!}</div>
               </div>
               <div className="messages-container">
                  {messages == "loading" ? (<>
                     {Array.from({ length: 4 }, (_, i) => i+1).map((v, index) => (
                        <div className='box full' key={index}>
                           <LoadingCard styles={{
                              width: "100%",
                              height: "50px"
                           }} />
                           <Spacing size={1} />
                        </div>
                     ))}
                  </>) : (<>
                     {messages.map(message => (
                        <div key={message.date} className={`message-${message.direction}`}>
                           <div className="message" style={{ whiteSpace: "pre-wrap" }}>{message.body}</div>
                           <div className="text-xt grey-4 fit pd-05">Sent at {formatMilliseconds(parseInt(message.date), true, true)}</div>
                        </div>
                     ))}
                  </>)}
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
