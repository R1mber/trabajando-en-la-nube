import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { auth } from '../config/firebase'
import routes from './routes'
import Login from '../views/Login/Login'

export default function AppRoute () {
  const [isLoggedIn_, setIsLoggedIn_] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn_(true)
        setLoad(true)
      } else {
        setLoad(true)
        setIsLoggedIn_(false)
      }
    })
  })

  useEffect(() => {
    if (load) {
      setIsLoading(false)
    }
  }, [load])

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            exact={true}
            path={route.path}
            element={
              route.isPrivate && !isLoggedIn_
                ? (
                  isLoading
                    ? <div className="bg-red-100">
                      cargando......
                    </div>
                    : <Login/>
                )
                : (<route.component/>

                )

            }

          />
        ))}
      </Routes>
    </BrowserRouter>

  )
}
