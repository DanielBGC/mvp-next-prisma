import { useSession, signOut, getSession } from 'next-auth/react'
import styles from '../styles/Home.module.css'
// import useRequiredAuth from '@/lib/useRequiredAuth';

export async function getServerSideProps(context) {
  const session = await getSession(context);

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
    }
  }
}

export default function Home() {

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
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleSignOut}>Sair</button>
    </div>
  )
}
