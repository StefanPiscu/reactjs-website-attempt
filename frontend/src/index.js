import "./index.css";
import ReactDOM from "react-dom"
import React, {useEffect, useState} from "react"
import App from "App"
import WIP from "components/WIP"
import About from "components/About"
import Contact from "components/Contact"
import Home from "components/Home"
import Login from "components/Login"
import Logout from "components/Logout"
import Register from "components/Register"
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom"
import {Journey, Page, ViewJourney, EditJourney, ViewPage, EditPage} from "components/Journey"


function EntryRouter() {

	const [user, setUser]=useState({
		username: "",
		email: "",
		isLoggedIn: false,
		powerLevel: 0,
	})

	useEffect(() =>{
		fetch("http://localhost:4000/api/user",{
			header: {"Content-type": "application/json"},
			credentials: "include",
		}).then(res => {
			if(res.status === 200){
				res.json().then(data =>{
					setUser({
						username: data.username,
						email: data.email,
						isLoggedIn: true,
						powerLevel: data.powerlevel,
					});
				})
			}else{
				res.json().then((data)=>{console.log(data)});
			}
		})

	}, [])

	return (
		<Router>
			<Routes>
				<Route path="/" element={<App userState={[user, setUser]} />} >
					<Route index element={<Home />} />
					<Route path="about" element={<About />} />
					<Route path="contact" element={<Contact />} />
					<Route path="login" element={<Login userState={[user, setUser]} />} />
					<Route path="register" element={<Register userState={[user, setUser]} />} />
					<Route path="logout" element={<Logout userState={[user, setUser]} />} />
					<Route path="journey">
						<Route index element={<Navigate to="/" replace={true}/>}/>
						<Route path=":journeyId" element={<Journey userState={[user, setUser]}/>}>
							<Route index element={<ViewJourney />}/>
							{<Route path="edit" element={<EditJourney />}/>}
							<Route path=":pageId" element={<Page />}>
								<Route index element={<ViewPage/>}/>
								<Route path="edit" element={<EditPage />}/>
							</Route>
						</Route>
					</Route>
					<Route path="*" element={<h1 className="ml-5 text-3xl font-extrabold text-light">This page does not exist</h1>} />
				</Route>
			</Routes>
		</Router>
	)
}

ReactDOM.render(<EntryRouter />, document.getElementById("root"));