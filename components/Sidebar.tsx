import React from 'react'
import { useHomeStateContext } from '../context/Home';
import { useBoardStateContext } from '../context/Board';
import { IBoard } from '../interfaces'
import Image from 'next/image';
import darkIcon from '../public/assets/icon-dark-theme.svg';
import lightIcon from '../public/assets/icon-light-theme.svg';
import { FiLogOut,FiSettings, FiEdit,FiArrowRight  } from 'react-icons/fi'; // Import the logout icon from a suitable icon library
import { useSession } from 'next-auth/react'; 
import {useRouter} from "next/navigation";

const Sidebar = () => {
  const { boards, boardSelectedId, setBoardSelectedId, showSidebar, setShowSidebar, darkMode, setDarkMode } = useHomeStateContext();
  const { updateBoardModal, setUpdateBoardModal,  } = useHomeStateContext();
  const { setDisplayAddEditBoard, setDisplayDeleteModal } = useBoardStateContext();
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const router = useRouter(); // Initialize the useRouter hook

  return (
    <>
      {
        showSidebar && (
          <div className='min-w-[15%] h-full flex flex-col justify-between bg-[#6e6e6e27] rounded-3xl pt-[10px] pr-6 pb-8 '>
            <div>
              
            <p className='text-hM text-slate-900 tracking-S font-bold ml-8 mb-5 flex items-center'>
  All Boards ({boards.length})
  {userRole !== 'manager' && (  <FiEdit className="ml-3 text-white text-xl hover:text-purple transition-colors duration-300 cursor-pointer closeModalUpdateBoardOff" onClick={() => setUpdateBoardModal(!updateBoardModal)} />
 )}
  {
    updateBoardModal && (
      <div className='w-[192px] h-[94px] bg-white dark:bg-darkBg flex flex-col justify-between p-4 absolute top-[30px] left-[220px] z-10 rounded-lg shadow-[0_10px_20px_rgba(54,78,126,0.25)] closeModalUpdateBoardOff'>
        <p onClick={() => {
          setDisplayAddEditBoard({ display: true, mode: 'EDIT' });
          setUpdateBoardModal(false);
        }} className='h-[24px] text-mediumGrey text-bL cursor-pointer hover:underline'>Edit Board</p>
        <p onClick={() => {
          setDisplayDeleteModal({ display: true, mode: 'board', id: boardSelectedId });
          setUpdateBoardModal(false);
        }} className='h-[24px] text-bL text-red cursor-pointer hover:underline'>Delete Board</p>
      </div>
    )
  }
</p>

              
              <div>
                {
                  boards.map((board) => (
                    <div key={board.id} onClick={() => setBoardSelectedId(board.id)} className={`w-92/100 max-w-[276px] h-[48px] flex flex-row items-center pl-8 cursor-pointer text-white font-bold  ${boardSelectedId === board.id ? `bg-purple` : 'hover:bg-white dark:hover:bg-white'} group rounded-full ml-10`}>
                      <svg className={`mr-4 ${boardSelectedId === board.id ? 'fill-white' : 'fill-white group-hover:fill-purple'}`} width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z" /></svg>
                      <p className={` mr-10 text-hM ${boardSelectedId === board.id ? 'text-white' : 'to-mediumGrey group-hover:text-purple'}`}>{board.name}</p>

                    </div>
                    
                  ))
                  
                }
                
                {userRole !== 'manager' && (  
                  <div onClick={() => setDisplayAddEditBoard({ display: true, mode: 'ADD' })} className='w-92/100 max-w-[276px] h-[48px] flex flex-row items-center pl-8 cursor-pointer text-mediumGrey font-bold hover:last:text-purple hover:bg-white dark:hover:bg-white hover:first:fill-purple group rounded-full'>
                  <svg className='mr-4 fill-purple' width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z" /></svg>
                  <p className='font-bold text-white group-hover:text-purple text-hM'>+ New Board</p>
                </div>)}
                {userRole === 'admin' && (  
                <p className='text-hM mt-5 text-slate-900 tracking-S font-bold ml-8 mb-5 flex items-center'>  All Users </p>
                )}
                {userRole === 'admin' && (  
                  <div  onClick={() => router.push('/admin')} className='w-92/100 max-w-[276px] h-[48px] flex flex-row items-center pl-8 cursor-pointer text-mediumGrey font-bold hover:last:text-purple hover:bg-white dark:hover:bg-white hover:first:fill-purple group rounded-full'>
                  <svg className='mr-4 fill-purple' width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z" /></svg>
                  <p className='font-bold text-white group-hover:text-purple text-hM'>users</p>
                </div>)}
                {userRole === 'admin' && (  
                  <div  onClick={() => router.push('/adduser')} className='w-92/100 max-w-[276px] h-[48px] flex flex-row items-center pl-8 cursor-pointer text-mediumGrey font-bold hover:last:text-purple hover:bg-white dark:hover:bg-white hover:first:fill-purple group rounded-full'>
                  <svg className='mr-4 fill-purple' width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z" /></svg>
                  <p className='font-bold text-white group-hover:text-purple text-hM'>+ add user</p>
                </div>)}

              </div>
            </div>
            <div className='w-92/100 h-[104px] flex flex-col justify-between'>
              <div className=' ml-6 w-[60%] h-[48px] flex items-center justify-center bg-lightBg rounded-md self-center'>
                <Image src={lightIcon} alt="light icon" />
                <label className="inline-flex relative items-center mx-6 cursor-pointer">
                  <input type="checkbox" value={0} className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                  <div className="w-10 h-5 bg-purple rounded-full peer peer-focus:ring-purple-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[6px] after:bg-white after:rounded-full after:h-[14px] after:w-[14px] after:transition-all"></div>
                </label>
                <Image src={darkIcon} alt="Dark icon" />
              </div>
              <div onClick={() => setShowSidebar(false)} className='ml-8 w-[80%] h-[48px] flex items-center group hover:bg-white dark:hover:bg-white rounded-3xl cursor-pointer'>
                <svg className='fill-slate-500 group-hover:fill-purple mr-[15px] ml-[30px]' width="18" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M8.522 11.223a4.252 4.252 0 0 1-3.654-5.22l3.654 5.22ZM9 12.25A8.685 8.685 0 0 1 1.5 8a8.612 8.612 0 0 1 2.76-2.864l-.86-1.23A10.112 10.112 0 0 0 .208 7.238a1.5 1.5 0 0 0 0 1.524A10.187 10.187 0 0 0 9 13.75c.414 0 .828-.025 1.239-.074l-1-1.43A8.88 8.88 0 0 1 9 12.25Zm8.792-3.488a10.14 10.14 0 0 1-4.486 4.046l1.504 2.148a.375.375 0 0 1-.092.523l-.648.453a.375.375 0 0 1-.523-.092L3.19 1.044A.375.375 0 0 1 3.282.52L3.93.068a.375.375 0 0 1 .523.092l1.735 2.479A10.308 10.308 0 0 1 9 2.25c3.746 0 7.031 2 8.792 4.988a1.5 1.5 0 0 1 0 1.524ZM16.5 8a8.674 8.674 0 0 0-6.755-4.219A1.75 1.75 0 1 0 12.75 5v-.001a4.25 4.25 0 0 1-1.154 5.366l.834 1.192A8.641 8.641 0 0 0 16.5 8Z" /></svg>
                <p className='font-bold text-slate-500 group-hover:text-purple text-hM'>Hide Sidebar</p>
              </div>
            </div>
          </div>
        )
      }
      {
        !showSidebar && (
          <div onClick={() => setShowSidebar(true)} className='w-[57px] h-12 group flex items-center bg-purple hover:bg-purpleHover cursor-pointer rounded-r-full absolute bottom-8'>
            <svg className='fill-white ml-[18px]' width="16" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M15.815 4.434A9.055 9.055 0 0 0 8 0 9.055 9.055 0 0 0 .185 4.434a1.333 1.333 0 0 0 0 1.354A9.055 9.055 0 0 0 8 10.222c3.33 0 6.25-1.777 7.815-4.434a1.333 1.333 0 0 0 0-1.354ZM8 8.89A3.776 3.776 0 0 1 4.222 5.11 3.776 3.776 0 0 1 8 1.333a3.776 3.776 0 0 1 3.778 3.778A3.776 3.776 0 0 1 8 8.89Zm2.889-3.778a2.889 2.889 0 1 1-5.438-1.36 1.19 1.19 0 1 0 1.19-1.189H6.64a2.889 2.889 0 0 1 4.25 2.549Z" /></svg>
          </div>
        )
      }
    </>
  )
}

export default Sidebar