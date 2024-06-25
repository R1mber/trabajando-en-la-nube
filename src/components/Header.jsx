import { Link } from 'react-router-dom'

export default function Home () {
  return (
    <div
      className='nav-bar'
    >
      <h1>Logo</h1>
      <di>
        <a>Inicio</a>
        <a>Productos</a>
        <a>Nosotros</a>
        <Link 
          to={'/Chat'}
          >Chat</Link>
        <Link
          className='btn btn-primary'
          to={'/Login'}
        >Iniciar Sesión</Link>
      </di>
    </div>
  )
}
