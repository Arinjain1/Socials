import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutuations'
import { useEffect } from 'react';
import { useUserContext } from '@/context/AuthContext';
import { INavLink } from '@/types';
import { sidebarLinks } from '@/constants';
import './leftSidebar.css'
import { pathToFileURL } from 'url';
import { isAsyncFunction } from 'util/types';

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();


  useEffect(() => {
    if (isSuccess) {
      navigate(0);
    }
  }, [isSuccess])
  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-11'>
        <Link to="/" className='flex gap-3 items-center '>
          <img
            src='/assets/images/logo.svg'
            alt='logo'
            width={170}
            height={36}
          />
        </Link>
        <Link to={`/profile/${user.id}`} className='gap-3 items-center profile-style'>
          <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className='h-14 w-14 rounded-full' />
          <div className='flex felx-col username-style'>
            <p className='body-bold'>
              {user.name}
            </p>
            <p className='small-regular text-light-3'>
              @{user.username}
            </p>
          </div>
        </Link>
        <ul className='flex flex-col gap-ul'>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li key={link.label}
                className={`leftsidebar-link group ${isActive && 'bg-primary-600'
                  }`}>
                <NavLink to={link.route} className='flex gap-4 items-center p-4'>
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${isActive && 'invert-white'
                      }`}
                  />

                  {link.label}
                </NavLink>
              </li>

            )
          })}
        </ul>
      </div>
      <div className='my-logout'>
        <Button variant="ghost" className='shad-button_ghost' onClick={() => signOut()}>
          <img src="/assets/icons/logout.svg" alt="logout" />
        </Button>
        <p className='small-medium lg: base-medium'>Logout</p>
      </div>
    </nav>
  )
}

export default LeftSidebar