import { ViewJourneyCard } from "./Journey";
import React, {useEffect, useState} from "react"

export default function Home(props){
 
  const [cardsList, setCardsList] = useState([]);
  useEffect(()=>{
    fetch("http://localhost:4000/api/journey/cards").then(res=>{
      if(res.status==200){
        res.json().then(data=>{
          setCardsList(data); 
        });
      }
    })
  }, [])
  return (
    <div className="flex flex-col items-center m-3">
      {cardsList.map((it, index)=>{
        return <ViewJourneyCard key={index} JourneyCardInfo={JSON.parse(it)} />
      })}
    </div>
  )
}