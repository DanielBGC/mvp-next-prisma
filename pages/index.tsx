import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSession, signOut, getSession } from 'next-auth/react'
import { FormEvent, useState } from 'react'
import { Task } from '@prisma/client'
import { prismaClient } from '../lib/prisma'
import styles from '../styles/Home.module.css'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  const tasks = await prismaClient.task.findMany({
    where: {
      isDone: false
    }
  })

  const dataTasks = tasks.map((task: any) => {
    return {
      ...task,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.createdAt.toISOString(),
    }
  })

  if(!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: {
      session,
      tasks: dataTasks
    }
  }
}

type TasksProps = {
  tasks: Task[]
}

export default function Home({ tasks }: TasksProps) {
  const [newTask, setNewTask] = useState('')

  const handleCreateTask = async (event: FormEvent) => {
    event.preventDefault();

    await fetch('http://localhost:3000/api/tasks/create', {
      method: 'POST',
      body: JSON.stringify({ title: newTask }),
      headers: {'Content-Type': 'application/json' }
    })
  }

  const { data: session } = useSession();

  if(!session) {
    return(<div>Loading...</div>)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className={styles.container}>
      <h1>{`Seja bem-vindo ${session?.user?.name}`} </h1>
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-4' onClick={handleSignOut}>Sair</button>
    
      <br/>
      <br/>
      <ul>
        {
          tasks.map((task) => <li className='text-4xl' key={task.id}>{task.title}</li>)
        }
      </ul>
      <form onSubmit={handleCreateTask} className='mt-10'>
        <div className="grid grid-cols-2">

          <div>
            <label htmlFor="task" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">New Task:</label>
            <input 
              type="text" 
              id="task" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={newTask} 
              onChange={e => setNewTask(e.target.value)} 
            />
          </div>
        </div>

        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2'>Create Task</button>

      </form>
    
    </div>
  )
}
