import React, {useState} from "react"
import {Link, Navigate} from "react-router-dom"

function RegisterField(props){
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

export default function Register(props){

  const [user, setUser] = props.userState;
  const [formData, setFormData]=useState({
    username: "",
    email: "",
    password: "",
    passwordconfirm: "",
  })

  const [Errors, setErrors]=useState([]);
  const [succesful, setSuccesful]=useState(false);
  const [submitOpen, setSubmitOpen]=useState(true);

  function handleChange(e){
    setFormData(prevState =>({ 
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  function validateEmail(email){
    return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }

  
  function handleSubmit(e){
    e.preventDefault();
    const inputErrors=[];
    if(submitOpen === false) return;
    setSubmitOpen(false);
    if(formData.email === "" || formData.username === "" || formData.password === "" || formData.passwordconfirm === ""){
      inputErrors.push("All fields are required")
    }
    else{
      if(!validateEmail(formData.email)){
        inputErrors.push("Invalid Email format");
      }
      if(formData.password.length < 6){
        inputErrors.push("Password must have at least 6 characters");
      }
      else if(formData.password != formData.passwordconfirm){
        inputErrors.push("Passwords do not match");
      }
    }
    if(inputErrors.length === 0){
      setErrors([]);
      fetch("http://localhost:4000/api/register",{
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
        //handle errors
      }).catch((err) => {
        inputErrors.push("Something went wrong! Try again later");
        setSubmitOpen(true);
      })
    }
    else{
      setErrors(inputErrors);
      setSubmitOpen(true);
    }
  }

  if(succesful){
    return <Navigate to="/" replace={true}/>
  }

  return(
    <div className="flex-grow flex">
      <div className="relative z-10 w-full  self-center flex items-center justify-evenly px-2">

        <form className="shadow-md shadow-dark rounded-md p-5 relative flex flex-col gap-3 bg-dark" onSubmit={handleSubmit}>
          <p className="text-accent self-center font-bold text-xl">Register</p>
          <RegisterField name="Username" value={formData["username"]} handleChange={handleChange}/> 
          <RegisterField name="email" value={formData["email"]} handleChange={handleChange}/> 
          <RegisterField name="Password" type="password" value={formData["password"]} handleChange={handleChange}/> 
          <RegisterField name="passwordconfirm" label="Confirm Password" type="password" value={formData["passwordConfirm"]} handleChange={handleChange}/> 
          {
            submitOpen
            ?(<button className="bg-soft text-accent mb-3 rounded-md px-2 w-min self-center shadow-sm shadow-gray-900 active:shadow-none transition-all">
              Submit
            </button>)
            :(<div className="bg-soft text-accent mb-3 rounded-md px-2 w-min self-center transition-all">
              Waiting
            </div>)
          } 
          <Link className="bg-soft p-2 rounded-md text-accent text-center" to="/login">
            Already have an account? Login Here
          </Link>
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