import React from 'react'
import { Link } from 'react-router-dom'
import { auth, db } from '../config/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

export default function Home () {
  const [user, setUser] = React.useState(null)
  const [load, setLoad] = React.useState(false)

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoad(true)
      } else {
        setLoad(true)
      }
    })
  })

  React.useEffect(() => {
    if (load) {
      getUser()
    }
  }, [load])

  const getUser = async () => {
    const user = auth.currentUser.uid
    const userRef = doc(db, 'users', user)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      console.log('User data:', userDoc.data())
      setUser(userDoc.data())
    } else {
      console.error('No such document!')
    }
  }

  return (
    <div
      className='nav-bar'
    >
      <h1>Logo</h1>
      <di>
        <Link
          to={'/'}>Inicio</Link>
        <Link
          to={'/Chat'}
        >Chat</Link>
        {
          user
            ? <Link
              className='btn btn-primary'
              to={'/User'}
            >{user.name}</Link>
            : <Link
              className='btn btn-primary'
              to={'/Register'}
            >Registro</Link>
        }
      </di>
    </div>
  )
}
