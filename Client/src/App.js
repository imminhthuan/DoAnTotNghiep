import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate  } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'



// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const DefaultLayoutStudent = React.lazy(() => import('./layout/DefaultLayoutStudent'))


const Loginsinhvien = React.lazy(() => import('./views/pages/login/loginsinhvien'))
// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const dispatch = useDispatch();
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const authData = useSelector((state) => state.admin.authData) || JSON.parse(localStorage.getItem('user'))

  console.log("auth", authData);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/" name="Login Page" element={<Login />} />
          <Route exact path="/loginsinhvien" name="Login Page" element={<Loginsinhvien />} >
           
          </Route>
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="/admin/*"  element={<DefaultLayout />} />
          <Route path="/student/*" element={<DefaultLayoutStudent />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>

      </Suspense>
    </HashRouter>
  )
}

export default App
