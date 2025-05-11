'use client'
import "@/styles/auth.css"
import { wait } from "@/utils/wait"
import { useState } from 'react'
import { createUser, userEmailExists, userLogIn } from "../Actions/Auth"
import BackTick from "@/components/BackTick/BackTick"
import { validateEmail } from "@/utils/validate"
import { signIn } from "next-auth/react"
import { redirect } from "next/navigation"

export default function LoginForm() {
   const [name, setName] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [password2, setPassword2] = useState("")
   const [error, setError] = useState<CustomError>({ status: false, message: "" });
   const [buttonLoading, setButtonLoading] = useState(false);
   const [authAction, setAuthAction] = useState<"loading" | "login" | "signup">("loading");

   const checkIfUserExists = async () => {
      setButtonLoading(true);
      await wait(0.2);
      const result = await userEmailExists(email);
      setAuthAction(result ? 'login' : 'signup');
      setButtonLoading(false);
   }

   const createAnAccount = async () => {
      setButtonLoading(true);
      await wait(0.2);
      if (name == "") {
         setError({ status: true, message: "Please enter your name" })
      } else if (password == "" || password2 == "") {
         setError({ status: true, message: "Please enter a password" })
      } else if (password !== password2) {
         setError({ status: true, message: "Passwords do not match" })
      } else {
         const result = await createUser(name, email, password);
         if (result) {
            const response = await signIn("credentials", {
               name, email, password
            })
            if (!response?.error) {
               redirect('/');
            } else {
               setError({ status: true, message: "There was an error while trying to log you in" })
            }
         } else {
            setError({ status: true, message: "Failed to create your account. Please try again." })
         }
      }
      setButtonLoading(false);
   }

   const logUserIn = async () => {
      setButtonLoading(true);
      await wait(0.2);
      const result = await userLogIn(email, password);
      if (result) {
         const response = await signIn("credentials", {
            name, email, password
         })
         if (!response?.error) {
            redirect('/');
         } else {
            setError({ status: true, message: "There was an error while trying to log you in" })
         }
      } else {
         setError({ status: true, message: "Incorrect email or password" })
      }
      setButtonLoading(false);
   }

   const continueBtn = async () => {
      setError({ status: false, message: "" })
      setButtonLoading(true);
      await wait(0.2);

      if (authAction == "loading") {
         if (email == "") {
            setError({ status: true, message: "Please enter your email" })
         } else if (validateEmail(email)) {
            checkIfUserExists();
         } else {
            setError({ status: true, message: "Please enter a valid email" })
         }
      } else if (authAction == "login") {
         await logUserIn();
      } else if (authAction == "signup") {
         await createAnAccount();
      }
   }

   return (<div className="auth">
      <div className="auth-container">
         <div className="text-c-xl bold-700 pd-1">{
            (authAction == "loading")
            ? 'Login or Sign Up'
            : (authAction == "login")
               ? 'Login'
               : 'Create an account'
         }</div>

         {/* // ! error handling */}
         {(error.status && error.message !== "") ? <>
            <div className="text-c-s error text-center">{error.message}</div>
         </> : <></>}

         <div className="form-content">
            {(authAction == "loading") 
            ? <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> 
            : <BackTick action={() => setAuthAction("loading")}>{email}</BackTick>}
         </div>

         {/* //* when user is logging in  */}
         {(authAction == "login") 
            ? <div className="form-content">
               <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div> 
         : <></>}

         {/* //* when user is signing up  */}
         {(authAction == "signup") ? <>
            <div className="form-content">
               <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-content">
               <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="form-content">
               <input type="password" placeholder="Password (again)" value={password2} onChange={(e) => setPassword2(e.target.value)} />
            </div>
         </> : <></>}

         <div className="form-content">
            <button onClick={continueBtn} disabled={buttonLoading}>{buttonLoading ? 'Loading...' : 'Continue'}</button>
         </div>
      </div>
   </div>)
}
