import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from './../../config/firebase'
import { useState, useEffect } from 'react'

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
      <div>Home</div>
      <div>
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
