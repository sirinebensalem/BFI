import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { FiUser } from 'react-icons/fi';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  useEffect(() => {
    if (session) {
      setUsername(session.user.name || ''); // Replace 'username' with the actual field name
      setEmail(session.user.email || ''); // Replace 'email' with the actual field name
    }
  }, [session]);
  const handleChangePassword = async () => {
    try {
      if (!session) {
        return;
      }

      const response = await fetch('/api/auth/getHashedPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: session.user.id }),
      });

      if (response.ok) {
        const { hashedPassword } = await response.json();
          const updateResponse = await fetch('/api/auth/changepassword', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: session.user.id, hashedPassword , oldPassword, newPassword }),
          });

          if (updateResponse.ok) {
            toast.success('Password has been changed');
            setOldPassword('');
            setNewPassword('');
          } else {
            console.error('Error updating password');
          }
        }  else {
        console.error('Error getting hashed password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!session) {
        return;
      }

      const response = await fetch('/api/auth/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id:session.user.id, username, email }),
      });

      if (response.ok) {
        toast.success('User has been updated')
        setTimeout(() => {
            signOut();
          }, 2000); 

          } else {
        console.error('Error updating user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  return (
<div className='bg-[#6e6e6e27]  rounded-3xl p-6 ml-[200px] mx-auto h-[500px] mt-11 w-[1000px]'>
      <h1 className='text-2xl font-semibold mb-4'>Update Your Profile</h1>


      <div className='flex'>
    <div className='w-full p-4'> 
    <img
      src='/photo.png' // Replace with the actual path to your image
      alt='Profile Photo'
      className='w-[150px] h-auto rounded-md'
    />
    <input
    type='file'
    accept='image/*'
     className='mt-4 rounded-md bg-white focus:outline-none focus:ring-purple'
    />
    </div>
    <div className='w-full p-4'>        
    <h2 className='text-lg font-semibold mb-2'>Change Password</h2>
        <div className='mb-4'>
          <input
            type='password'
            placeholder='Old Password'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className='w-full py-2 px-3 rounded-md bg-white focus:outline-none focus:ring-purple'
          />
        </div>
        <div className='mb-4'>
          <input
            type='password'
            placeholder='New Password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='w-full py-2 px-3 rounded-md bg-white focus:outline-none focus:ring-purple'
          />
        </div>
        <button
          onClick={handleChangePassword}
          className='w-full py-2 px-4 bg-purple text-white rounded-2xl hover:bg-purpleHover focus:outline-none focus:ring-purple'
        >
          Change Password
        </button></div>
  </div>

  {/* Bottom row */}
  <div className=''>
    <div className=' p-4'>      <div className='mb-4'>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='w-full py-2 px-3 rounded-md bg-white focus:outline-none focus:ring-purple'
        />
      </div>
      <div className='mb-4'>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full py-2 px-3 rounded-md bg-white focus:outline-none focus:ring-purple'
        />
      </div>
      <button
        onClick={handleUpdate}
        className='w-full py-2 px-4 bg-purple text-white rounded-2xl hover:bg-purpleHover focus:outline-none focus:ring-purple'
      >
        Save changes
      </button></div>
  </div>
    </div>
  );
}
