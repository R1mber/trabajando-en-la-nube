import views from '../views'
import { HOME, LOGIN, REGISTER, USER, CHAT } from './paths'

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

const User = {
  component: views.User,
  path: USER,
  isPrivate: false
}

const Chat = {
  component: views.Chat,
  path: CHAT,
  isPrivate: false
}

const routes = [

  // aqui se agregan las rutas nuevas
  User,
  Login,
  Register,
  Chat,
  Home]

export default routes
