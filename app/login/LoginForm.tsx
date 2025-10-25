'use client'
import "@/styles/auth.css"
import { useState } from 'react'
import { userEmailExists, userLogIn } from "../actions/auth"
import { validateEmail } from "@/utils/validate"
import { signIn } from "next-auth/react"
import { redirect } from "next/navigation"
import { CustomIcon } from "@/components/Icons/Icon"
import BackTick from "@/components/BackTick/BackTick"
import AwaitButton from "@/components/AwaitButton/AwaitButton"

export default function LoginForm() {
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [error, setError] = useState<CustomError>({ status: false, message: "" });
   const [authAction, setAuthAction] = useState<"loading" | "login">("loading");

   const checkIfUserExists = async (callback: Function) => {
      const result = await userEmailExists(email);
      if (result.success && result.data) {
         setAuthAction('login');
      } else {  
         setError({ status: true, message: "User doesn't exist" })
      }
      callback();
   }

   const logUserIn = async (callback: Function) => {
      const result = await userLogIn(email, password);
      if (result.success && result.data) {
         const response = await signIn("credentials", { email, password })
         if (!response?.error) {
            redirect('/');
         } else {
            setError({ status: true, message: "There was an error while trying to log you in" })
            callback();
         }
      } else {
         setError({ status: true, message: "Incorrect email or password" })
         callback();
      }
   }

   const continueBtn = async (callback: Function) => {
      setError({ status: false, message: "" })
      if (authAction == "loading") {
         if (email == "") {
            setError({ status: true, message: "Please enter your email" })
            callback();
         } else if (validateEmail(email)) {
            checkIfUserExists(callback);
         } else {
            setError({ status: true, message: "Please enter a valid email" });
            callback();
         }
      } else if (authAction == "login") {
         await logUserIn(callback);
      }
   }

   return (<div className="auth">
      <div className="auth-container">
         <div className="box full dfb align-center justify-center">
            <CustomIcon url="/logo.png" size={40} round />
         </div>
         <div className="text-xl bold-700 pd-1">Login to Minweb</div>

         {/* // ! error handling */}
         {(error.status && error.message !== "") ? <>
            <div className="text-xxs error text-center pd-1 bold-500 mt-05 mb-05">
               {error.message}
            </div>
         </> : <></>}

         <div className="form-content">
            {(authAction == "loading") 
            ?  <input 
                  type="text" 
                  className="xxs full pd-13 pdx-2" 
                  placeholder="Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}   
               /> 
            : <BackTick action={() => setAuthAction("loading")}>{email}</BackTick>}
         </div>

         {/* //* when user is logging in  */}
         {(authAction == "login") 
            ? <div className="form-content">
               <input 
                  className="xxs full pd-13 pdx-2"
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} />
            </div> 
         : <></>}

         <div className="form-content">
            <AwaitButton className="xxs full" onClick={continueBtn}>Continue</AwaitButton>
         </div>
      </div>
   </div>)
}
