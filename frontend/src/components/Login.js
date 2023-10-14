import React, {useState} from "react"
import {Link, Navigate, useLocation} from "react-router-dom"


function LoginField(props){
  return(
    <div className="flex flex-col w-full justify-between gap-2">
      <label className="text-accent uppercase font-semibold"
      htmlFor={props.name}>
      {(props.label!=null ? props.label : props.name) + ":"}
      </label>
      <input className="bg-soft text-accent outline-none rounded-sm indent-1 py-3 px-3 mb-2 leading-tight"
        id={props.name}
        type={props.type}
        name={props.name.toLowerCase()}
        placeholder=""
        value={props.value}
        onChange={props.handleChange}
      />
    </div>
  )
}

export default function Login(props){
  const [formData, setFormData]=useState({
    username: "",
    password: "",
  })
  const [Errors, setErrors]=useState([]);
  const [succesful, setSuccesful]=useState(false);
  const [submitOpen, setSubmitOpen]=useState(true);
  const [user, setUser]=props.userState;

  function handleChange(e){
    setFormData(prevState =>({ 
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }
  function handleSubmit(e){
    e.preventDefault();
    const inputErrors=[];
    if(submitOpen === false) return;
    setSubmitOpen(false);
    setErrors([]);
    if(formData.username === "" || formData.password === ""){
      inputErrors.push("All fields are required")
      setErrors(inputErrors);
      setSubmitOpen(true);
      return;
    }
    fetch("http://localhost:4000/api/login",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(formData),
    }).then(res => {
      if(res.status==200){
        res.json().then(data =>{
          setUser({
            username: data.username,
            email: data.email,
            isLoggedIn: true,
          });
          setSuccesful(true);
        })
      }
      else{
        res.json().then(data =>{
          data.errors.forEach(it =>{
            inputErrors.push(it);
          })
          setErrors(inputErrors);
        })
      }
      setSubmitOpen(true);
    }).catch((err) => {
      inputErrors.push("Something went wrong! Try again later");
      setErrors(inputErrors);
      setSubmitOpen(true);
    })
  }

  if(succesful){
    return <Navigate to="/" replace={true} />
  }

  return(
    <div className="flex-grow flex">
      <div className="relative z-10 w-full  self-center flex items-center justify-evenly px-2">
        <form className="shadow-md shadow-dark rounded-md p-5 relative flex flex-col gap-3 bg-dark" onSubmit={handleSubmit}>
          <p className="text-accent self-center font-bold text-xl">Login</p>
          <LoginField name="Username" value={formData["username"]} handleChange={handleChange}/> 
          <LoginField name="Password" type="password" value={formData["password"]} handleChange={handleChange}/> 
          {
            submitOpen
            ?(<button className="bg-soft text-accent mb-3 rounded-md px-2 w-min self-center shadow-sm shadow-gray-900 active:shadow-none transition-all">
              Submit
            </button>)
            :(<div className="bg-soft text-accent mb-3 rounded-md px-2 w-min self-center transition-all">
              Waiting
            </div>)
          }
          <Link className="bg-soft p-2 rounded-md text-accent text-center" to="/register">
            Don't have an account? Register Here
          </Link>
          <p className="p-2 text-accent text-center">
             If you forgot your password<br/>
             contact me (check contact page)
          </p>
          {(Errors.length > 0 && 
            <ul className=" list-disc list-inside">
              {
                Errors.map((it, index) => {
                return (<li key={index} className="text-sm text-rose-500 marker:text-rose-800">
                  {it}
                </li>); 
              })}
            </ul>
          )}
        </form>
      </div>
    </div>
  )
}