import Link from "next/link";
//import { LoginForm } from "./LoginForm";
import { Toaster } from 'react-hot-toast';
import { useState } from "react"
import toast from 'react-hot-toast';

import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
export default function LoginPage(){
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl')|| '/dashboard'
    const router = useRouter()
    const [error ,setError] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const onSubmit = async(e:React.FormEvent) => {
        e.preventDefault()
        try {
           const res = await signIn('credentials', {
                redirect:false,
                email,
                password,
                callbackUrl
            })
            if(!res?.error){
                router.push('/')
            }else{
                setError("Invalid email or password..."); // Set error state for displaying the error message
                toast.error(` wrong password or email !`);

            }
        }catch(err :any){ 

        }

    }

    return (
<div>
<div className="bg-gradient-to-r from-green-200 via-lime-200 to-green-200 text-white min-h-screen flex items-center justify-center">
<div className="flex-none w-1/3 pr-1 mb-10 mr-10">
          <img src="/bfi.svg" alt="Registration" className="mx-auto" />
        </div> 
  <div className="w-full max-w-xs p-6 rounded-lg bg-gray-700 bg-opacity-20 shadow-md ml-4">
        <h2 className="text-xl font-semibold text-white mb-4 text-center">Sign In</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-white mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 px-3 rounded-md bg-white focus:outline-none focus:ring-purple"
              placeholder="Enter your email"
              style={{ color: 'black' }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-white mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 px-3 rounded-md bg-white focus:outline-none focus:ring-purple"
                placeholder="Enter your password"
                style={{ color: 'black' }}
              />
          <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-2 py-1.5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="black"
                      className="bi bi-eye-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                      <path
                        d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="black"
                      className="bi bi-eye-slash"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"
                      />
                      <path
                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"
                      />
                      <path
                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"
                      />
                    </svg>
                  )}
                </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple text-white rounded-md hover:bg-purpleHover focus:outline-none focus:ring-purple"
          >
            Login
          </button>

           
        </form>

      </div>
    </div>        <Toaster />

</div>        

    
        
    )
    
}