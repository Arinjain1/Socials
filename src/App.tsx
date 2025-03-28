// import React from 'react'
 import {Routes,Route} from 'react-router-dom';
import './globals.css'
import SigninForm from './_auth/forms/SigninForm';

import SignupForm from './_auth/forms/SignupForm';
import { Home } from './_root/pages';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  return (
 <main>
    <Routes>
        {/*public routes */}
        <Route element={<AuthLayout/>}>
        <Route path='/sign-in' element={<SigninForm/>}/>
        <Route path='/sign-up' element={<SignupForm/>}/>
        </Route>
     
        {/*Private routes */}
        <Route>
            <Route element={<RootLayout/>}>
            <Route index element={<Home/>}/>
            </Route>
        </Route>
       
    </Routes>
    <Toaster/>
 </main>
  )
}

export default App