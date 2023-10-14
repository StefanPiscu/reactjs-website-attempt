import React, {useState} from "react"
import {Link} from "react-router-dom"

function LinkItem(props){
  return (
    <Link className="text-accent px-1 bg-dark bg-opacity-30 w-min rounded-md whitespace-nowrap"
      to={props.route.toLowerCase()}
      onClick={props.onClick}
    >
      {props.name}
    </Link>
  )
}

function NavList(props){
  return (
    <>
      <LinkItem route="/" name="Home" onClick={props.onClick}/>
      <LinkItem route="/about" name="About" onClick={props.onClick}/>
      <LinkItem route="/contact" name="Contact" onClick={props.onClick}/>
      {props.user.isLoggedIn
      ?<LinkItem route="/logout" name="Logout" onClick={props.onClick}/>
      :<LinkItem route="/login" name="Login" onClick={props.onClick}/>
      }
    </>
  )
}

export default function Navbar(props){
  let keyCounter=0;

  const [menu, setMenu] = useState(false);

  function toggleMenu(){
    setMenu(prevState => !prevState); 
  }
 

  return(
    <>
    <div className="hidden sm:block">
      <div className="flex justify-evenly basis-1/2 text-light">
        <NavList user={props.user} />
      </div>
    </div>
    <div className="sm:hidden">
      <button onClick={toggleMenu} className="relative w-7 z-50">
        {menu 
          ?<img className="m-0.5 w-6 h-6" src="assets/x-symbol.svg" />
          :<img className="w-7 h-7" src="assets/Hamburger_icon.svg" />
        }
      </button>
      <div className={"fixed transition-transform duration-300 transform translate-x-full flex flex-col justify-evenly pl-4 z-40 backdrop-blur-md \
        top-0 right-0 w-40 h-full" + (menu ? " translate-x-0":"")}>
        <NavList user={props.user} onClick={toggleMenu}/>
      </div>
    </div>
    </>
  )
}