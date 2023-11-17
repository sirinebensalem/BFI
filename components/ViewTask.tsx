import React, { useEffect, useState } from 'react'
import { useBoardStateContext } from '../context/Board';
import { useHomeStateContext } from '../context/Home';
import { useTaskStateContext } from '../context/Task';
import { Comment, IColumn, Task } from '../interfaces';
import { useSession } from 'next-auth/react'; 
import { FiSend } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { PhotoIcon } from '@heroicons/react/24/solid';

const ViewTask = () => {
  const { viewTask, setViewTask, displayViewTaskChangeColumn, setDisplayViewTaskChangeColumn, displayModalEditDeleteTask, setDisplayModalEditDeleteTask, setDisplayEditTask } = useTaskStateContext();
  const { boards, setBoards, boardSelectedId } = useHomeStateContext();
  const { setDisplayDeleteModal } = useBoardStateContext();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const [comments, setComments] = useState<Comment[]>([]); // State to hold comments

  // Fetch comments when the task or session changes
  useEffect(() => {
    if (viewTask.task) {
      fetchComments(viewTask.task.id);
    }
  }, [viewTask.task, session]);
  
  const fetchComments = async (taskId: string) => {
    try {
      const response = await fetch(`/api/auth/comment?taskId=${taskId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  let completeBoardSelected = boards.find((board) => board.id === boardSelectedId);

  const getCompletedSubCount = (task: Task | null) => {
    let count = 0;
    task?.subtasks?.forEach((sub) => {
      if (sub.isCompleted) {
        count++;
      }
    });
    return count;
  }

  const editSubtask = async (subtaskIndex: number) => {
    const newSubtasks = viewTask.task?.subtasks?.map((sub, index) => {
      if (index === subtaskIndex) {
        return {
          ...sub,
          isCompleted: !sub.isCompleted
        }
      }
      else return { ...sub }
    })
    const task = {
      ...viewTask.task, subtasks: newSubtasks,
    };

    let res = await fetch("api/task", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    })
    const newTask = await res.json();
    console.log("Editing Task successful", { newTask });

    const newBoards = boards.map((board) => {
      if (board.id === boardSelectedId) {
        const newTasks: Task[] = [];
        const newColumns: IColumn[] = [];
        board.columns.forEach((col) => {
          if (col.id === newTask[0].columnId) {
            col.tasks?.forEach((task) => {
              if (task.id === newTask[0].id) {
                newTasks.push(newTask[0]);
              }
              else newTasks.push(task)
            })
            newColumns.push({ ...col, tasks: newTasks })
          }
          else newColumns.push({ ...col })
        })
        return { ...board, columns: newColumns }
      }
      else return { ...board }
    });
    setBoards(newBoards);
    setViewTask({ ...viewTask, task: newTask[0] });
  }

  const editColumnTask = async (newColumnTask: IColumn) => {
    let task = {
      ...viewTask.task,
      status: newColumnTask.name,
      columnId: newColumnTask.id,
    }

    let res = await fetch("api/task", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, column: { id: newColumnTask.id, task } })
    })
    const newTask = await res.json();
    console.log("Editing Column Task Successful", { newTask });

    const newBoards = boards.map((board) => {
      if (board.id === boardSelectedId) {
        let newTasks: Task[] = [];
        const newColumns: IColumn[] = [];
        board.columns.forEach((col) => {
          newTasks = [];
          if (col.id === newTask[0].columnId) {
            col.tasks?.forEach((task) => newTasks.push(task));
            newTasks.push(newTask[0]);
            newColumns.push({ ...col, tasks: newTasks })
          }
          else if (col.id === viewTask.task?.columnId) {
            col.tasks?.forEach((task) => {
              if (task.id !== newTask[0].id) {
                newTasks.push(task)
              }
            })
            newColumns.push({ ...col, tasks: newTasks })
          }
          else newColumns.push({ ...col })
        })
        return { ...board, columns: newColumns }
      }
      else return { ...board }
    });
    setBoards(newBoards);
    setViewTask({ ...viewTask, task: newTask[0] });
  }
const [newComment, setNewComment] = useState('');

const handleSubmitcomment = async (e: React.FormEvent) => {
  e.preventDefault();
    
  if (!session) {
    return;
  }

  const taskid = viewTask.task?.id;
  const username = session?.user.name;

  try {
    const res = await fetch('/api/auth/comment', {
      method: 'POST',
      body: JSON.stringify({ taskid, username, newComment }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
 const newCommentObject: Comment = {
        id: 'placeholder_id', // Replace with a valid unique identifier
        username,
        text: newComment,
      };

      // Update the comments state with the new comment
      setComments([...comments, newCommentObject]);
      setNewComment(''); // Clear the input field      setNewComment(''); // Clear the input field
      toast.success('Comment added successfully');
    } else {
      toast.error('Failed to add comment');
    }
  } catch (error) {
    console.error(error);
    toast.error('An error occurred while adding the comment');
  }
    

}

  
  return (
    <>
      <div onClick={() => setViewTask({ display: false, task: null })} className='w-screen h-screen absolute bg-black/50 z-20 top-0' />
      <div className='w-[600px] h-[800px] flex flex-col p-8 rounded-md bg-white dark:bg-darkGrey absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 z-20'>
        <div className='w-full flex justify-between relative'>
          <p className='max-w-[380px] text-hL font-bold dark:text-white'>{viewTask.task?.title}</p>
          {userRole !== 'manager' && (  
        <svg onClick={() => setDisplayModalEditDeleteTask(true)} className='cursor-pointer closeModalEditDeleteTaskOff' width="5" height="20" xmlns="http://www.w3.org/2000/svg"><g fill="#828FA3" fillRule="evenodd"><circle cx="2.308" cy="2.308" r="2.308" /><circle cx="2.308" cy="10" r="2.308" /><circle cx="2.308" cy="17.692" r="2.308" /></g></svg>
           )}
          {
            displayModalEditDeleteTask && (
              <div className='w-[192px] h-[94px] flex flex-col justify-between bg-lightBg dark:bg-darkBg p-4 rounded-lg absolute z-30 top-[60px] -right-[96px] closeModalEditDeleteTaskOff'>
                <p onClick={() => {
                  if (viewTask.task) {
                    setDisplayEditTask({ display: true, task: viewTask.task });
                    setDisplayModalEditDeleteTask(false);
                    setViewTask({ display: false, task: null });
                  }
                }} className=' text-bL text-mediumGrey hover:underline cursor-pointer'>Edit Task</p>
                <p onClick={() => {
                  if (viewTask.task?.id) {
                    setDisplayDeleteModal({ display: true, mode: 'task', id: viewTask.task.id });
                    setDisplayModalEditDeleteTask(false);
                    setViewTask({ display: false, task: null });
                  }
                }} className=' text-bL text-red hover:underline cursor-pointer'>Delete Task</p>
              </div>
            )
          }
        </div>
        <p className='w-full text-hS text-mediumGrey leading-L my-6'>{viewTask.task?.description}</p>
        <button 
          type="button"
          className="w-full h-[200px] mt-5 mb-5 border-gray-300 bg-slate-200 rounded-md outline-none p-5 focus-visible:ring-2 first-letter:
          focus-visible:ring-blue-500 focus-visible:ring-offset-2">
            <PhotoIcon
            className="h-6 w-6 mr-2 inline-block" 
            />
            
          </button>
        {userRole !== 'manager' && (
                  <p className='font-bold text-bM text-mediumGrey dark:text-white'>Subtasks ({getCompletedSubCount(viewTask.task)} of {viewTask.task?.subtasks?.length})</p>

          )}
 
        <div className='w-full flex flex-col mt-4'>
          {userRole !== 'manager' &&
            viewTask.task?.subtasks?.map((subtask, index) => (
              <div onClick={(e) => {
                const target = e.target as Element;
                if (!target.id.includes('inputCheckbox')) {
                  editSubtask(index)
                }
              }} key={subtask.title} className="w-full min-h-[40px] flex items-center p-3 rounded bg-lightBg dark:bg-darkBg hover:bg-purple/25 hover:dark:bg-purple/25 cursor-pointer mb-2 last:mb-0">
                <input id={`inputCheckbox-${index}`} checked={subtask.isCompleted} onClick={() => { }} onChange={() => { }} type="checkbox" className="min-w-4 w-4 h-4 text-purple cursor-pointer rounded outline-none focus:shadow-none focus:ring-0 mr-4" />
                <label htmlFor={`inputCheckbox-${index}`} className={`w-[360px] text-hS ${subtask.isCompleted ? 'text-mediumGrey line-through' : 'dark:text-white'} font-bold cursor-pointer`}>{subtask.title}</label>
              </div>
            ))
          }
        </div>
                
        <div className='w-full h-[150px] flex flex-col justify-between mt-6 relative'>
        {userRole !== 'manager' && (          
        <p className='font-bold text-bL text-mediumGrey dark:text-white'>Current Status</p>
         )}
        {userRole !== 'manager' && (          

          <div onClick={() => setDisplayViewTaskChangeColumn(true)} className={`w-full h-10 flex items-center justify-between px-4 py-2 border border-mediumGrey/25 hover:border-purple ${displayViewTaskChangeColumn ? 'border-purple' : ''} rounded cursor-pointer`}>
          
            <p className='text-bL dark:text-white'>{viewTask.task?.status}</p>
            
            <svg className={`${displayViewTaskChangeColumn ? 'rotate-180' : ''}`} width="10" height="7" xmlns="http://www.w3.org/2000/svg"><path stroke="#635FC7" strokeWidth="2" fill="none" d="m1 1 4 4 4-4" /></svg>
          </div>
        )}
          { 
            displayViewTaskChangeColumn &&   (
              <div className='w-[416px] bg-white dark:bg-darkBg flex flex-col absolute top-[75px] z-10 rounded-lg shadow-[0_10px_20px_rgba(54,78,126,0.25)] closeModalViewTaskChangeColumnOff'>
                {
                  completeBoardSelected?.columns.map((col) => (
                    <div key={col.id} onClick={() => {
                      if (col.id !== viewTask.task?.columnId) {
                        editColumnTask(col);
                      }
                      setDisplayViewTaskChangeColumn(false);
                    }} className='w-full h-[50px] flex items-center group hover:bg-purple cursor-pointer hover:first:rounded-t-lg hover:last:rounded-b-lg px-4'>
                      <p className='text-bL text-mediumGrey group-hover:text-white'>{col.name}</p>
                    </div>
                  ))
                }
                
              </div>
            )
          }
<div className="flex mt-6">
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 py-2 px-3 rounded-full bg-white focus:outline-none focus:ring-purple"
      />
      <button
        onClick={handleSubmitcomment}
        className="ml-4 flex items-center font-bold text-gray-800 group-hover:text-purple hover:text-purple bg-gray-200 bg-opacity-50 hover:bg-opacity-70 rounded-full px-4 py-2 transition-colors"
      >
        <FiSend className="mr-1" />
        Comment
      </button>
    </div>
        </div>

        <div className='bg-slate-100 rounded-2xl h-[200px] overflow-auto mt-4'>
        {comments.map((comment, index) => (
        <div key={index} className="p-4 border-b">
           
            <div className="flex flex-col">
                <span className="text-blue-500 text-sm font-semibold mb-1">    
                @{comment.username}        
                <img
                src='/photo.png' // Replace with the actual path to your image
                alt='Profile Photo'
                className='w-[15%] rounded-full '/></span> 
                <p className='text-lg'>Comment : </p>
                <p className="text-gray-700">{comment.text}</p>
            </div>
        </div>
    ))}
</div>
      </div>
    </>
  )
}

export default ViewTask