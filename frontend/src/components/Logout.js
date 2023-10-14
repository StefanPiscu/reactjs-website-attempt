import React, {useEffect} from "react"
import {Navigate} from "react-router-dom"

export default function Logout(props){

  const [user, setUser] = props.userState;


  useEffect(
  () => {
    fetch("http://localhost:4000/api/logout", {
      method: "POST",
      credentials: "include",
    })
    setUser({
      email: "",
      username: "",
      isLoggedIn: false,
      powerLevel: 2
    })
  }
  ,[])

  return (
    <Navigate to="/" replace={true} />
  )
}