import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './../../config/firebase'
import { Header } from '../../components'
import { useNavigate } from 'react-router-dom'
// componete de catalog de truques
export default function Home () {
  const [users, setUsers] = useState([])
  const history = useNavigate()

  const getUsers = async () => {
    const usersCollection = collection(db, 'products')
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

      <div className='body-home'>
        {users.map(user => (
          <div
            className='card-home'
            key={user.id}
          >
            <div
              style={{ width: '100%' }}
            >
              <img src={user.imageUrl} alt='product' />
              <h3>{user.name}</h3>
              <p>{user.description}</p>
              <p style={{ fontWeight: 'bold' }} >Objeto a cambio:</p>
              <p>{user.object}</p>
              <p><strong>Cantidad: </strong>{user.price}</p>
            </div>
            <button
            // onClick={() => history(`/chat/${user.id}`)}
              onClick={() => history('/chat')}
              className='btn btn-primary'
            >Contactar</button>
          </div>
        ))}
      </div>
    </>
  )
}
