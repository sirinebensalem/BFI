import React, { useState } from 'react';
import ellipsis from '../public/assets/icon-vertical-ellipsis.svg';
import Image from 'next/image';
import { useHomeStateContext } from '../context/Home';
import { useBoardStateContext } from '../context/Board';
import { useTaskStateContext } from '../context/Task';
import { signOut, useSession } from 'next-auth/react'; // Import useSession hook
import Avatar from 'react-avatar';
import Link from "next/link";
import {useRouter} from "next/navigation";
import { FiLogOut,FiSettings, FiEdit,FiArrowLeft  } from 'react-icons/fi'; // Import the logout icon from a suitable icon library

const Header = () => {
  const {showSidebar } = useHomeStateContext();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const router = useRouter(); // Initialize the useRouter hook

    const handleLogout = () => {
      signOut();
      setShowLogoutModal(false);
    };
  
  // Access the session user's data
  const { data: session } = useSession();
  const handleSettingsClick = () => {
    router.push('/settings');
  };

  return (
    <div className='flex flex-row items-center justify-between h-[9.5%] bg-gradient-to-r from-green-200 via-lime-200 to-lime-200'>
      <div className={`w-[15%] h-[60px] flex items-center  rounded-3xl bg-[#6e6e6e27] ${showSidebar === false ? 'border-b' : ''}`}>
      <img
      src='/photo.png' // Replace with the actual path to your image
      alt='Profile Photo'
      className='w-[35%] '
    />
        <div className="ml-1  flex items-center font-bold text-bl">{session?.user?.name}</div>
        <span className="ml-1 text-mediumGrey">{session?.user?.role}</span>

      </div>

      <div className="mr-10 flex items-center">

        {/* Logout Button */}
        


        <div className="flex items-center">
  <button
    className="ml-4 flex items-center font-bold text-gray-800 dark:text-white group-hover:text-purple hover:text-purple bg-gray-200 bg-opacity-50 hover:bg-opacity-70 rounded-full px-4 py-2 transition-colors duration-300"
    onClick={() => setShowLogoutModal(true)}
  >
    <FiLogOut className="mr-1" />
    Logout
  </button>
</div>
<button
          className="ml-3 text-gray-800 dark:text-white text-xl hover:text-white transition-colors duration-300"
          onClick={handleSettingsClick}
        >
          <FiSettings />
        </button>

        
        {/* Logout Modal */}
        {showLogoutModal && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-darkBg flex flex-col justify-center p-6 absolute top-1/4 z-10 rounded-lg shadow-lg">
      <p className="text-xl font-semibold dark:text-white mb-4">
        Are you sure you want to logout?
      </p>
      <div className="flex justify-end">
        <button
          className="mr-2 text-hM font-semibold dark:text-white hover:text-purple"
          onClick={() => setShowLogoutModal(false)}
        >
          Cancel
        </button>
        <button
          className="ml-4 flex items-center font-bold text-gray-800 dark:text-white group-hover:text-red hover:text-red bg-gray-200 bg-opacity-50 hover:bg-opacity-70 rounded-xl px-4 py-2 transition-colors duration-300"
          onClick={handleLogout}
        >
          <FiLogOut className="mr-2" /> Logout
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default Header;
