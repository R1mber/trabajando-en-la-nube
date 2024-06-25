import { useState } from 'react'
import { db, createUser, auth } from './../../config/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export default function Register () {
  const [error, setError] = useState(null)
  const history = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const name = form.name.value
    const email = form.email.value
    const password = form.password.value

    try {
      const userCredential = await createUser(auth, email, password)
      const user = userCredential.user
      const userRef = doc(db, 'users', user.uid)
      await setDoc(userRef, {
        uid: user.uid,
        name,
        email,
        password
      })

      form.reset()
      setError(null)
      history('/user')
    } catch (error) {
      console.error(error)
      setError(error.code)
    }
  }

  const translateError = (code) => {
    switch (code) {
    case 'auth/email-already-in-use':
      return 'El correo electrónico ya está en uso'
    case 'auth/invalid-email':
      return 'El correo electrónico no es válido'
    case 'auth/weak-password':
      return 'La contraseña es muy débil'
    default:
      return 'Error al crear la cuenta'
    }
  }

  return (
    <div className="content-form">
      <div className="form">
        <h1>Crear cuenta</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" required />
          </div>
          {
            error && <div style={{ color: 'red' }} >{translateError(error)}</div>
          }
          <button type="submit">Crear</button>
        </form>
      </div>
    </div>
  )
}
