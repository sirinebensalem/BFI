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
            toast.success(`User added Successfully`);
        }else {
            setError('User already exists');
            toast.error(`User already exists`);

        }

    }catch(error:any){
        setError(error?.message);
    }
    

}

  return (

  <div className="bg-[#6e6e6e27]  rounded-3xl p-6 ml-[500px] mx-auto h-[590px] mt-11 w-[500px]">
      <h1 className='text-2xl font-semibold mb-4 text-center'>Add User</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-bold text-black mb-1" htmlFor="email">
              Username :
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-2 px-3 rounded-md bg-white focus:outline-none focus:ring-purple"
              placeholder="Enter your username"
              style={{ color: 'black' }}
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold text-black mb-1" htmlFor="email">
              Email :
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 px-3 rounded-md text-black focus:outline-none focus:ring-purple"
              placeholder="Enter your email"
              style={{ color: 'black' }}
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold text-black mb-1" htmlFor="email">
              Password :
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2 px-3 rounded-md bg-white focus:outline-none focus:ring-purple"
              placeholder="Enter your password"
              style={{ color: 'black' }}
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold text-black mb-1" htmlFor="email">
            Confirm Password :
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
              className="w-full py-2 px-3 rounded-md bg-white focus:outline-none focus:ring-purple"
              placeholder="Enter your password"
              style={{ color: 'black' }}
            />
          </div>
          <div className="mb-4">
          <label className="block font-bold text-black mb-1" htmlFor="role">
            Role :
          </label>
          <select
            id="role"
            name="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full py-2 px-3 rounded-md bg-white focus:outline-none focus:ring-purple"
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
            className="w-full py-2 px-4 bg-purple text-white rounded-2xl hover:bg-purpleHover focus:outline-none focus:ring-purple"
          >
            Add user
          </button>
           
        </form>

      </div>
  );
}

export default RegistrationForm;
