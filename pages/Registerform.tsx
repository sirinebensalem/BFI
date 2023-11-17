// Your registration form component
import React, { useState } from 'react';
import {useRouter} from "next/navigation";
import { signIn } from "next-auth/react"
import { ALert } from '../components/alert';
import Link from 'next/link';
import toast from 'react-hot-toast';

function RegistrationForm() {
  const router = useRouter()
  const [error ,setError] = useState('')
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const [confirmPassword, setconfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error(`Passwords do not match !`);


      return;
    }      
    try {
        const res = await fetch ('/api/auth/register' , {
            method:'POST',
            body: JSON.stringify({username,email,password,role}),
            headers:{
              'Content-Type': 'application/json'  
            }
        })
        if(res.ok){
            signIn()
            router.push('/api/auth/signin')
        }else {
            setError('User already exists');
            toast.error(`User already exists`);

        }

    }catch(error:any){
        setError(error?.message);
    }
    

}

  return (
<div className="bg-gradient-to-r from-yellow-50 via-purple-500 to-slate-500 text-white min-h-screen flex items-center justify-center">
<div className="flex-none w-1/3 pr-1 mb-10 mr-10">
          <img src="/bfi.svg" alt="Registration" className="mx-auto" />
        </div> 
  <div className="w-full max-w-xs p-6 rounded-lg bg-gray-700 bg-opacity-20 shadow-md ml-4">
        <h2 className="text-xl font-semibold text-white mb-4 text-center">Sign up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-white mb-1" htmlFor="email">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-2 px-3 rounded-md bg-gray-100 focus:outline-none focus:ring-purple"
              placeholder="Enter your username"
              style={{ color: 'black' }}
            />
          </div>
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
              className="w-full py-2 px-3 rounded-md bg-gray-100 focus:outline-none focus:ring-purple"
              placeholder="Enter your email"
              style={{ color: 'black' }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-white mb-1" htmlFor="email">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2 px-3 rounded-md bg-gray-100 focus:outline-none focus:ring-purple"
              placeholder="Enter your password"
              style={{ color: 'black' }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-white mb-1" htmlFor="email">
            Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
              className="w-full py-2 px-3 rounded-md bg-gray-100 focus:outline-none focus:ring-purple"
              placeholder="Enter your password"
              style={{ color: 'black' }}
            />
          </div>
          <div className="mb-4">
          <label className="block text-sm text-white mb-1" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            name="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full py-2 px-3 rounded-md bg-gray-100 focus:outline-none focus:ring-purple"
            style={{ color: 'black' }}
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
            <option value="manager">Manager</option>
          </select>
        </div>



          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple text-white rounded-md hover:bg-purpleHover focus:outline-none focus:ring-purple"
          >
            Register
          </button>
          <div className="text-center mt-6">
				<p className="mt-4 text-sm">don't have Account ? <Link className="text-blue-900 hover:underline" href="/login"> Sign in</Link>
				</p>
			</div>
           
        </form>

      </div>
    </div> 
  );
}

export default RegistrationForm;
