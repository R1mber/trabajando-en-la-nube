import views from '../views'
import { HOME, LOGIN, REGISTER } from './paths'

const Home = {
  component: views.Home,
  path: HOME,
  isPrivate: false
}

const Login = {
  component: views.Login,
  path: LOGIN,
  isPrivate: false
}

const Register = {
  component: views.Register,
  path: REGISTER,
  isPrivate: false
}

const routes = [

  // aqui se agregan las rutas nuevas

  Login,
  Register,
  Home]

export default routes
