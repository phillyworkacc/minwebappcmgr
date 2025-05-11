'use client'

import './Icons.css'
import { appUrl } from '@/utils/constants'

type IconProps = {
   size: number;
   url?: string;
}

export function TikTokIcon({ size }: IconProps) {
   return <div className="icon" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={appUrl + '/icons/tiktok.png'} alt="icon" />
   </div>
}

export function InstagramIcon({ size }: IconProps) {
   return <div className="icon" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={appUrl + '/icons/instagram.png'} alt="icon" />
   </div>
}

export function SnapchatIcon({ size }: IconProps) {
   return <div className="icon" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={appUrl + '/icons/snapchat.png'} alt="icon" />
   </div>
}

export function MyPocketSkillIcon({ size }: IconProps) {
   return <div className="icon" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={appUrl + '/icons/mypocketskill.png'} alt="icon" />
   </div>
}

export function AndroidIcon({ size }: IconProps) {
   return <div className="icon" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={appUrl + '/icons/android.png'} alt="icon" />
   </div>
}

export function LinuxIcon({ size }: IconProps) {
   return <div className="icon" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={appUrl + '/icons/linux.png'} alt="icon" />
   </div>
}

export function WindowsIcon({ size }: IconProps) {
   return <div className="icon" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={appUrl + '/icons/windows.png'} alt="icon" />
   </div>
}

export function IOSIcon({ size }: IconProps) {
   return <div className="icon" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={appUrl + '/icons/ios.png'} alt="icon" />
   </div>
}

export function MacOSIcon({ size }: IconProps) {
   return <div className="icon" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={appUrl + '/icons/macos.png'} alt="icon" />
   </div>
}

export function DesktopIcon({ size }: IconProps) {
   return <div className="icon" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={appUrl + '/icons/desktop.png'} alt="icon" />
   </div>
}

export function MobileIcon({ size }: IconProps) {
   return <div className="icon" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={appUrl + '/icons/mobile.png'} alt="icon" />
   </div>
}

export function MinwebIcon({ size }: IconProps) {
   return <div className="icon" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={appUrl + '/applogo.png'} alt="icon" />
   </div>
}

export function DetixIcon({ size }: IconProps) {
   return <div className="icon round" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={appUrl + '/icons/detix.png'} alt="icon" />
   </div>
}

export function CustomIcon({ size, url }: IconProps) {
   return <div className="icon round" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={url} alt="icon" />
   </div>
}