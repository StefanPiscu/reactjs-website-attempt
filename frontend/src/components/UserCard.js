import React from "react"

export default function UserCard(){
  return (
    <div className=" justify-self-center rounded-md bg-dark h-full w-min p-2 flex flex-col">
      <div className="mb-2 w-min">
        <img src="https://picsum.photos/400" width={500} height={500}/>
      </div>
      <div className="mb-2 w-min">
        <img src="https://picsum.photos/400" width={500} height={500}/>
      </div>
      <div className="w-min">
        <img src="https://picsum.photos/400" width={500} height={500}/>
      </div>
      
    </div>
  )
}