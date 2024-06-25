import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './../../config/firebase'
import { Header } from '../../components'
// componete de catalog de truques
export default function Home () {
  const [users, setUsers] = useState([])
  const getUsers = async () => {
    const usersCollection = collection(db, 'users')
    const usersSnapshot = await getDocs(usersCollection)
    const usersList = usersSnapshot.docs.map(doc => {
      return { ...doc.data(), id: doc.id }
    }
    )
    setUsers(usersList)
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <>
      <Header />
      <div className='body'>
        users:
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.name}
              {user.email}

            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
