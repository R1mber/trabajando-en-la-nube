import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, auth } from './../../config/firebase'

export default function Login () {
  const [error, setError] = useState(null)
  const history = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const email = form.email.value
    const password = form.password.value

    try {
      await signIn(auth, email, password)
      form.reset()
      history('/user')
      setError(null)
    } catch (error) {
      console.error(error)
      setError(error.code)
    }
  }

  const translateError = (code) => {
    console.log(code)
    switch (code) {
    case 'auth/user-not-found':
      return 'El usuario no existe'
    case 'auth/wrong-password':
      return 'La contraseña es incorrecta'
    case 'auth/invalid-credential':
      return 'Credenciales inválidas'
    default:
      return 'Error al iniciar sesión'
    }
  }

  return (
    <div className="content-form">
      <div className="form">
        <h1>Crear cuenta</h1>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Ingresar</button>
        </form>
        <Link to={'/Register'}
          className='btn btn-secondary'
        >Registrarse</Link>
      </div>
    </div>
  )
}
