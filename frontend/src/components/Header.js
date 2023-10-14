import React from "react"
import Logo from "components/logo"
import Navbar from "components/Navbar"

export default function Header(props){
  return(
    <>
    <div className=" sticky z-20 t-0 w-full shadow-md shadow-dark flex justify-between items-center p-2 mb-3 bg-dark">
      <Logo />
      <Navbar user={props.user}/>
    </div>
    </>
  )
}