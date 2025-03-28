import { Outlet, Navigate } from 'react-router-dom';
import './AuthLayout.css'

const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (<Navigate to="/" />
      ) : (
        <>
          <section className='flex flex-1 justify-between items-center'>
           <div className='button-style'>
           <Outlet />
            </div> 
          

            <img
              src="/assets/images/side-img.svg"
              alt='logo'
              className='hidden xl:block h-screen w-1/2 object-cover bg-no-repeat'
            />
            </section>
        </>
      )
      }
    </>
    // <div>AuthLayout</div>
  )
}

export default AuthLayout