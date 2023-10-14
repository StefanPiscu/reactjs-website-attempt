import React from "react"
import { Outlet } from "react-router-dom";
import Header from "components/Header";
import Footer from "components/Footer";

export default function App(props){

  const [user, setUser] = props.userState;
  
  return(
    <>
      <Header user={user} />
      <Outlet />
      <Footer />
    </>
  )
}
