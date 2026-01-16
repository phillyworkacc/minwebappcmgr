'use client'
import './Modal.css'
import { X } from 'lucide-react';
import { ReactNode } from 'react'

type ModalProps = {
   children: ReactNode;
   onClose: () => void;
}

export function Modal ({ children, onClose }: ModalProps) {
   return (
      <div className="modal">
         <div className='modal-box'>
            <div className="modal-close" onClick={onClose}><X /></div>
            {children}
         </div>
      </div>
   )
}
