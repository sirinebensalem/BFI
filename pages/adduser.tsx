import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar';
import Board from '../components/Board';
import { useHomeStateContext } from '../context/Home';
import { IBoard } from '../interfaces';
import { getBoards } from './api/board';
import SidebarAdmin from '../components/sidebaradmin';
import UserBoard from '../components/Adminboard';
import RegistrationForm from '../components/addUser';



const adminPage = () => {

  return (
    <Layout title="bfi App">
      <div className='width-full h-[90.5%] flex flex-row  bg-gradient-to-br from-green-200 via-lime-200 to-green-200'>
        <SidebarAdmin />
        <RegistrationForm/>
      </div>

    </Layout>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session && session.user.role=='admin') {
    const boards = await getBoards()
    const updatedboards = JSON.parse(JSON.stringify(boards))
    return { props: { boards: updatedboards } }
  }
  else return {
    props: {},
    redirect: {
      permanent: false,
      destination: "/login"
    }
  }
}


export default adminPage
