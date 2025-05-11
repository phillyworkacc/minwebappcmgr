'use client'

import { X } from 'lucide-react'
import { ReactNode, useState } from 'react'

type ModalProps = {
   title: string;
   children: ReactNode;
   showModal: boolean;
   closeAction: Function;
}

export default function Modal({ title, children, showModal, closeAction }: ModalProps) {
   return (
      <div className={`modal ${showModal ? 'show' : ''}`}>
         <div className="modal-box">
            <div className="close">
               <div className="title">{title}</div>
               <button className="outline-black" onClick={() => closeAction()}><X /> Close</button>
            </div>
            <div className="body">{children}</div>
         </div>
      </div>
   )
}
