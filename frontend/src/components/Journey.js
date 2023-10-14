import React, {useEffect, useState, useRef} from "react"
import {Link, Outlet, useLocation, Navigate, useOutletContext, useParams} from "react-router-dom"
import usePrompt from "hooks/usePrompt"
import parse from "html-react-parser"
import showdown from "showdown"
import DOMPurify from "dompurify";
import { sampleJourney } from "components/sampleJourney"

class JourneySection{
  constructor(){
    this.title="";
    this.content="";
  }
}

class JourneyPage{
  constructor(){
    this.title = "";
    this.description = "";
    this.summary = "";
    this.sections = []; //sections
  }
}


class JourneyData{
  constructor(id=""){
    this.title = "";
    this.authors = [];
    this.editors = [];
    this.collaborators = [];
    this.summary = "";
    this.description = "";
    this.pages = [];
    this.id = id;
  }
}

function TextArea(props){
  
  const ref = useRef(null);

  useEffect(()=>{
    ref.current.style.height="0";
    ref.current.style.height=(ref.current.scrollHeight)+"px";
    ref.current.style.width="0";
    ref.current.style.width=(ref.current.scrollWidth+6)+"px";
  });

  return (
    <div className="m-3">
      <textarea ref={ref} className={"bg-dark rounded-md p-1.5 resize-none overflow-y-hidden overflow-x-auto whitespace-nowrap max-w-full align-middle "+props.className}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e)=>{
          props.update(e.target.value);
        }}
      /> 
    </div>
  )
}


const converter=new showdown.Converter({
  tables: true,
  noHeaderId: true,
  disableForced4SpacesIndentedSublists: true,
  requireSpaceBeforeHeadingText: true,
});

function JSXFromMarkdown(markdownString){
  const htmlString="<div class=\"markdown-wrapper\">"+converter.makeHtml(markdownString)+"</div>";
  const cleanHtmlString=DOMPurify.sanitize(htmlString, {USE_PROFILES: {html: true}});
  return parse(cleanHtmlString);
}

function ViewPagePreview(props) {
  const [myJourney, setMyJourney]=props.JourneyState;
  const index=props.index;
  const it=myJourney.pages[index];
  const path = useLocation().pathname.split('/');
  let route;
  if(path[path.length-1]==="edit") route=`../${index}/edit`
  else route=`${index}`

  return(
    <div key={index} className="bg-soft rounded-md m-3 p-3 shadow-md">
      {props.previewToggleButton}
      <Link to={route}><h1 className="text-contrast font-bold text-2xl text-center mb-2">{it.title}</h1></Link>
      {JSXFromMarkdown(it.description)}
    </div>
  )
  
}

function ViewJourneyTitlecard(props){
  const [myJourney, setMyJourney]=props.JourneyState;
  var authorString = "";
  if(myJourney.authors.length===1) authorString="anonymous";
  else{
    authorString=myJourney.authors[0];
    for(let i=1;i<myJourney.authors.length;++i){
      if(myJourney.authors[i]=="") continue;
      authorString = authorString+", "+myJourney.authors[i];
    }
  }

  var editorString = "";
  if(myJourney.editors.length>0){
    editorString=myJourney.editors[0];
    for(let i=1;i<myJourney.editors.length;++i){
      if(myJourney.editors[i]=="") continue;
      editorString = editorString+", "+myJourney.editors[i];
    }
  } 
  return(
    <div className="bg-soft rounded-md p-3 m-3 shadow-md">
      {props.previewToggleButton}
      <div className="mb-1 text-xs text-right w-fit m-auto">
        <h1 className="text-contrast font-bold text-2xl text-center">{myJourney.title}</h1>
        <p className="inline"> written by {authorString} </p>
        {editorString != "" && <p className="inline-block">and edited by {editorString}</p>}
      </div>
      <span className="text-md">{JSXFromMarkdown(myJourney.summary)}</span>
    </div>
  )
}

export function ViewJourney(props){
  const outletContext=useOutletContext();
  const [myJourney, setMyJourney] = outletContext.JourneyState;
  return(
    <div className="m-3 flex justify-center">
      <div className="text-accent bg-dark rounded-md p-3 m-3 max-w-full w-fit self-center min-w-1/2">
        {props.previewToggleButton}
        <ViewJourneyTitlecard JourneyState={[myJourney, setMyJourney]}/>
        <div>
          {
            myJourney.pages.map((it, index) =>{
              return <ViewPagePreview JourneyState={[myJourney, setMyJourney]} index={index}/>
            })
          }
        </div>
      </div>
    </div>
  )
}

function ViewPageTitlecard(props){
  const [myPage, setPage]=props.PageState;
  return (
    <div className="bg-soft rounded-md p-3 m-3 shadow-md">
      {props.previewToggleButton}
      <h1 className="text-contrast font-bold text-2xl text-center mb-2">{myPage.title}</h1>
      {JSXFromMarkdown(myPage.summary)}
    </div>
  )
}

function ViewSection(props){
  const [myPage, setMyPage]=props.PageState;
  const mySection=myPage.sections[props.index];
  return(
    <div className="bg-soft rounded-md p-3 m-3 shadow-md">
      {props.previewToggleButton}
      <h1 className="text-contrast font-bold text-xl mb-2">{mySection.title}</h1>
      {JSXFromMarkdown(mySection.content)}
    </div>
  )

}

export function ViewPage(props){
  const outletContext=useOutletContext();
  const [myPage, setPage] = outletContext.PageState;

  return(
    <div className="text-accent bg-dark rounded-md p-3 m-3 mac-w-full w-fit self-center shadow-md min-w-1/2">
      <div className="flex justify-between">
        {props.previewToggleButton}
        <Link to={`../../${props.previewToggleButton!=undefined ? "edit" : ""}`}>Go To Journey</Link>
      </div>
      
      <ViewPageTitlecard PageState={[myPage, setPage]}/>
      {
      myPage.sections.map((it, index) =>{
        return(
          <ViewSection PageState={[myPage, setPage]} index={index} key={index}/>
        )
      })
    }
    </div>
  )
}

export function Journey(props){
  const [user, setUser]=props.userState;
  const path=useLocation().pathname.split('/');
  const params=useParams();

  const journeyId=params.journeyId;
  let viewType="view";
  if(path[path.length-1]==="edit") viewType="edit";

  console.log(sampleJourney);
  const [myJourney, setMyJourney] = useState(sampleJourney);
  const [foundJourney, setFoundJourney] = useState(false);

  useEffect(()=>{
    fetch(`http://localhost:4000/api/journey/${journeyId}/${viewType}`, {
      method: "GET",
      credentials: "include",
    }).then((res)=>{
      if(res.status===200){
        res.json().then((data)=>{
          setFoundJourney(true);
          setMyJourney(data);
        })
      }
    })

  }, []);
  const userCollab = myJourney.collaborators.filter(it => it===user.username).length > 0;

  if(path[path.length-1]==="edit" && user.powerLevel<1 && !userCollab){
    return <p className="text-accent text-lg m-2">Sorry, but you are not allowed here, if you think this is a mistake try logging in</p>;
  }

  if(path[path.length-1]!=="edit" && !foundJourney){
    return <p className="text-accent text-lg m-2">Sorry, but this journey doesn't exist</p>;
  }

  

  return (
    <>
    <Outlet context={{JourneyState: [myJourney, setMyJourney]}} />
    {path[path.length-1] === "edit" && <JourneySettings JourneyState={[myJourney, setMyJourney]} />}
    </>
  )
}

function CollabList(props){
  const [myJourney, setMyJourney] = props.JourneyState;
  const [newCollab, setNewCollab] = useState("");
  return(
    <>
    <form
      onSubmit={(e)=>{
        e.preventDefault();
        setMyJourney(prevJourney=>{
          let newJourney={...prevJourney};
          newJourney.collaborators.push(newCollab);
          return newJourney;
        })
        setNewCollab("");
      }}
    >
      <input className="bg-dark text-accent rounded-md p-2 mr-2"
        type="username"
        value={newCollab}
        onChange={(e)=>{
          setNewCollab(e.target.value);
        }}
      />
      <button className="text-green-400 bg-dark rounded-md p-2" >Add</button>
    </form>
    {myJourney.collaborators.length != 0 &&
      <div className="flex flex-wrap gap-3 p-2 bg-dark text-accent mb-3 rounded-md">
        {myJourney.collaborators.map((it, index) =>{
          return(
            <div key={index} className="bg-soft px-2 rounded-md flex gap-2">
              <span className=" text-center">{it}</span>
              <div className="bg-red-400 text-dark h-fit m-0.5 p-0.5 rounded-md">
                <button className="h-min text-xs"
                  onClick={()=>{
                    setMyJourney((prevState)=>{
                      const newState={...prevState};
                      newState.collaborators=newState.collaborators.filter((filIt, filIndex)=>{
                        return filIndex != index;
                      })
                      return newState;
                    })
                  }}
                >Delete</button>
              </div>
            </div>
          )
        })}
      </div>
    }
    </>
  )
}

function JourneySettings(props){
  const [myJourney, setMyJourney] = props.JourneyState;
  let [myJourneySaved, setMyJourneySaved] = useState(JSON.parse(JSON.stringify(myJourney)));

  let saved=false;

  const params=useParams();
  if(JSON.stringify(myJourney) === JSON.stringify(myJourneySaved)) saved=true;
  else saved=false;

  usePrompt("You haven't saved the changes, are you sure you want to leave?", !saved);

  function commitJourney(){
    const myJourneyJSON=JSON.stringify(myJourney);
    setMyJourneySaved(JSON.parse(myJourneyJSON));
    fetch("http://localhost:4000/api/journey/commit", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({
        pathname: params.journeyId,
        journey: myJourneyJSON 
      }),
    }).then((res)=>{
      if(res.status===200){
        setMyJourneySaved(JSON.parse(myJourneyJSON));
      }
    })
  } 

  function saveJourney(){
    const myJourneyJSON=JSON.stringify(myJourney);
    setMyJourneySaved(JSON.parse(myJourneyJSON));
    fetch("http://localhost:4000/api/journey/save", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({
        pathname: params.journeyId,
        journey: myJourneyJSON 
      }),
    }).then((res)=>{
      if(res.status===200){
        setMyJourneySaved(JSON.parse(myJourneyJSON));
      }
    })
  }

  let route=`/journey/${params.journeyId}`;


  return(
    <div className="m-3">
    <CollabList JourneyState={[myJourney, setMyJourney]}/>
    <div className="bg-dark rounded-md p-2 flex justify-evenly m-auto gap-3 text-accent">
      <button
        className="p-1 rounded-md"
        onClick={commitJourney}
      >Commit</button>
      <button
        className="p-1 rounded-md"
        onClick={saveJourney}
      >Save</button>
      <Link to={route}
        className="self-center"
      >{saved?"Exit":<span className="text-red-400">Exit Without Saving</span>}</Link>
    </div>
    </div>
  )
}

export function Page(){
  const outletContext=useOutletContext();
  const [myJourney, setMyJourney] = outletContext.JourneyState;

  let params=useParams();
  const id=params.pageId;

  function setPage(newPage){
    let newJourney = {...myJourney};
    newJourney.pages[id]=newPage;
    setMyJourney(newJourney);
  }

  if(myJourney.pages.length<=id||id<0){
    return(
      <p className="text-accent text-xl">This page doesn't exist</p>
    )
  }

  return (
    <Outlet context={{PageState: [myJourney.pages[id], setPage]}} />
  )
}

function PreviewToggleButton(props){
  const [preview, setPreview]=props.PreviewState;

  function togglePreview(){
    setPreview(prevState=>!prevState)
  }

  return(
    <div>
      <button className="p-1 rounded-lg"
      onClick={togglePreview}>{preview ? "Edit" : "Preview"}</button>
    </div>
  )
}

function EditPagePreview(props){
  const [myJourney, setMyJourney]=props.JourneyState;
  const index=props.index;
  const it=myJourney.pages[index];

  const [preview, setPreview] = useState(false);
  const [deletePage, setDeletePage] = useState(false);
  
  const path = useLocation().pathname.split('/');
  let route;
  if(path[path.length-1]==="edit") route=`../${index}/edit`
  else route=`${index}`

  function deletePageFromJourney(index){
    setDeletePage(false);
    setMyJourney(prevState => {
      let newJourney = {...prevState};
      newJourney.pages=prevState.pages.filter((it, ind)=>(ind!=index));
      return newJourney;
    })
  }

  return(
    <>
    {preview
      ?(
        <ViewPagePreview JourneyState={[myJourney, setMyJourney]} previewToggleButton={<PreviewToggleButton PreviewState={[preview, setPreview]}/>} index={index}/>
      )
      :( 
        <div className="bg-soft rounded-md m-3 p-3 flex flex-col shadow-md">
          <div className="flex justify-between mb-1 items-center">
            <PreviewToggleButton PreviewState={[preview, setPreview]}/>
            <Link to={route}><span className="p-0.5 rounded-md text-contrast">Go to page</span></Link>
            {deletePage
            ?(
              <div className="text-sm">
                <button className="h-fit p-0.5 mr-1 rounded-lg bg-red-400 bg-opacity-70 text-dark"
                  onClick={()=>(deletePageFromJourney(index))}
                >Confirm</button>
                <button className="h-fit p-0.5 rounded-lg bg-red-400 bg-opacity-70 text-dark"
                  onClick={()=>(setDeletePage(false))}
                >Cancel</button>
              </div>
            )
            :(
              <button className="h-fit p-0.5 text-sm rounded-lg bg-red-400 bg-opacity-70 text-dark"
                onClick={()=>setDeletePage(true)}
              >Delete Page</button>
            )
            }


          </div>
          <div className="flex justify-evenly items-center mb-1">
            <input style={{width: `${Math.max(it.title.length, 5)*16}px`}}
              className="text-contrast bg-dark rounded-md font-bold text-2xl self-center font-mono text-center max-w-full"
              value={it.title}
              type="text"
              placeholder="Title"
              onChange={(e)=>{
                setMyJourney(prevState => {
                  let newJourney={...prevState};
                  newJourney.pages[index].title=e.target.value;
                  return newJourney;
                });
              }}
            />
          
          </div>
          <TextArea className="self-start"
            value={it.description}
            placeholder="Description"
            update={value=>{
              setMyJourney(prevState =>{
                let newJourney={...prevState};
                newJourney.pages[index].description=value;
                return newJourney;
            });
          }}/>
        </div>
      )
    }
    </>
  )
}

function EditJourneyTitlecard(props){
  const [myJourney, setMyJourney] = props.JourneyState;
  const [preview, setPreview] = useState(false);
  function handleAuthorChange(e){
    setMyJourney(prevState =>{
      let newJourney = {...prevState};
      newJourney.authors[e.target.name]=e.target.value;
      newJourney.authors = newJourney.authors.filter( it =>{
        return it != "";
      })
      newJourney.authors.push("");
      return newJourney;
    })
  }

  function handleEditorChange(e){
    setMyJourney(prevState =>{
      let newJourney = {...prevState};
      newJourney.editors[e.target.name]=e.target.value;
      newJourney.editors = newJourney.editors.filter( it =>{
        return it != "";
      })
      newJourney.editors.push("");
      return newJourney;
    })
  }

  useEffect(()=>{
    setMyJourney(prevState =>{
      let newJourney = {...prevState};
      newJourney.authors = newJourney.authors.filter( it =>{
        return it != "";
      })
      newJourney.authors.push("");
      newJourney.editors = newJourney.editors.filter( it =>{
        return it != "";
      })
      newJourney.editors.push("");
      return newJourney;
    })
  }, [])

  return(
    <>
    {preview
    ?(
      <ViewJourneyTitlecard JourneyState={[myJourney, setMyJourney]} previewToggleButton={<PreviewToggleButton PreviewState={[preview, setPreview]}/>}/>
    )
    :(
      <div className="bg-soft rounded-md p-3 m-3 flex flex-col shadow-md">
        <PreviewToggleButton PreviewState={[preview, setPreview]}/>
        <input className="text-contrast bg-dark rounded-md font-bold text-2xl self-center font-mono text-center mb-1 max-w-full"
            style={{width: `${Math.max(myJourney.title.length, 5)*16}px`}}
            value={myJourney.title}
            type="text"
            placeholder="Title"
            onChange={(e)=>{
              setMyJourney(prevState => {
                let newJourney={...prevState};
                newJourney.title=e.target.value;
                return newJourney;
              });
            }}
        />
        <div>
          <p className="text-sm mb-1">Authors
          {myJourney.authors.map((it, index) =>{
              let width=it.length;
              return(
              <span key={index}>{index != 0 && <span>,</span>}
              <input className="bg-dark text-accent text-center outline-none rounded-md px-2 py-1 mr-0.5 ml-2 leading-tight font-mono max-w-full"
                style={{width: `${Math.max(width, 5)*11.0}px`}}
                type="text"
                name={index}
                value={it}
                onChange={handleAuthorChange}
              /></span>
              )
            })}
          </p>
          <p className="text-sm">Editors
          {
            myJourney.editors.map((it, index) =>{
              let width=it.length;
              return(
              <span key={index}>{index !=0 && <span>,</span>}
              <input className="bg-dark text-accent text-center outline-none rounded-md px-2 py-1 mr-0.5 ml-2 leading-tight font-mono max-w-full"
                style={{width: `${Math.max(width, 5)*11.0}px`}}
                key={index+30}
                type="text"
                name={index}
                value={it}
                onChange={handleEditorChange}
              /></span>
              )
            })
          }
          </p>
        </div>
        <TextArea className="my-2 self-start"
          value={myJourney.summary}
          placeholder="Summary"
          update={value=>{
            setMyJourney(prevState =>{
              let newJourney={...prevState};
              newJourney.summary=value;
              return newJourney;
          });
        }}/>
      </div>
    )
    }
    </>
  )
}

export function EditJourney(){
  const outletContext=useOutletContext();

  const [myJourney, setMyJourney] = outletContext.JourneyState;
  const [preview, setPreview] = useState(false);

  return(
    <>
    <div className="m-3 flex justify-center">
      <EditJourneyCard JourneyState={[myJourney, setMyJourney]}/>
    </div>
    {preview
    ?(
      <ViewJourney JourneyState={[myJourney, setMyJourney]} previewToggleButton={<PreviewToggleButton PreviewState={[preview, setPreview]}/>}/>
    )
    :(
      <div className="m-3 flex justify-center">
        <div className="text-accent bg-dark rounded-md p-3 m-3 max-w-full w-fit self-center shadow-md min-w-1/2">
          <PreviewToggleButton PreviewState={[preview, setPreview]}/>
          <EditJourneyTitlecard JourneyState={[myJourney, setMyJourney]}/>
          <div>{
            myJourney.pages.map((it, index) =>{
              return(
                <EditPagePreview key={index} JourneyState={[myJourney, setMyJourney]} index={index} />
              )
            })
          }</div>
          <div className="flex justify-center">
            <button className="bg-soft p-0.5 h-fit rounded-md"
              onClick={()=>{
                setMyJourney(prevState =>{
                  let newState = {...prevState};
                  newState.pages.push(new JourneyPage("", "", "", []));
                  return newState;
                })
              }}
            >Add New Page</button>

          </div>
        </div>
      </div>
    )}
    </>
  )
}

function EditSection(props){
  const [myPage, setMyPage]=props.PageState;
  const index=props.index;
  const it=myPage.sections[index];

  const [preview, setPreview] = useState(false);
  const [deleteSection, setDeleteSection] = useState(false);
  
  function deleteSectionFromPage(index){
    setDeleteSection(false);
    let newPage = {...myPage};
    newPage.sections=newPage.sections.filter((it, ind)=>(ind!=index));
    setMyPage(newPage);
  }

  return(
    <>
    {preview
      ?(
        <ViewSection PageState={[myPage, setMyPage]} previewToggleButton={<PreviewToggleButton PreviewState={[preview, setPreview]}/>} index={index}/>
      )
      :( 
        <div className="bg-soft rounded-md m-3 p-3 flex flex-col shadow-md">
          <div className="flex justify-between mb-1 items-center">
            <PreviewToggleButton PreviewState={[preview, setPreview]}/>
            {deleteSection
            ?(
              <div className="text-sm">
                <button className="h-fit p-0.5 mr-1 rounded-lg bg-red-400 bg-opacity-70 text-dark"
                  onClick={()=>(deleteSectionFromPage(index))}
                >Confirm</button>
                <button className="h-fit p-0.5 rounded-lg bg-red-400 bg-opacity-70 text-dark"
                  onClick={()=>(setDeleteSection(false))}
                >Cancel</button>
              </div>
            )
            :(
              <button className="h-fit p-0.5 text-sm rounded-lg bg-red-400 bg-opacity-70 text-dark"
                onClick={()=>setDeleteSection(true)}
              >Delete Section</button>
            )
            }


          </div>
          <div className="flex justify-evenly items-center mb-1">
            <input style={{width: `${Math.max(it.title.length, 5)*16}px`}}
              className="text-contrast bg-dark rounded-md font-bold text-2xl self-center font-mono text-center max-w-full"
              value={it.title}
              type="text"
              placeholder="Title"
              onChange={(e)=>{
                let newPage={...myPage};
                newPage.sections[index].title=e.target.value;
                setMyPage(newPage);
            }}/>
          </div>
          <TextArea className="self-start"
            value={it.content}
            placeholder="Content"
            update={value=>{
              let newPage={...myPage};
              newPage.sections[index].content=value;
              setMyPage(newPage);
          }}/>
        </div>
      )
    }
    </>
  )
}

function EditPageTitlecard(props){
  const [myPage, setMyPage] = props.PageState;
  const [preview, setPreview] = useState(false);

  return(
    <>
    {preview
    ?(
      <ViewPageTitlecard PageState={[myPage, setMyPage]} previewToggleButton={<PreviewToggleButton PreviewState={[preview, setPreview]}/>}/>
    )
    :(
      <div className="bg-soft rounded-md p-3 m-3 flex flex-col">
        <PreviewToggleButton PreviewState={[preview, setPreview]}/>
        <input className="text-contrast bg-dark rounded-md font-bold text-2xl self-center font-mono text-center mb-1 shadow-md max-w-full"
            style={{width: `${Math.max(myPage.title.length, 5)*16}px`}}
            value={myPage.title}
            type="text"
            placeholder="Title"
            onChange={(e)=>{
              let newPage={...myPage};
              newPage.title=e.target.value;
              setMyPage(newPage);
            }}
        />
        <TextArea className="my-2 self-start"
          value={myPage.summary}
          placeholder="Summary"
          update={value=>{
            let newPage={...myPage};
            newPage.summary=value;
            setMyPage(newPage);
          }}
        />
      </div>
    )
    }
    </>
  )
}

export function EditPage(){
  const outletContext=useOutletContext();

  const [myPage, setMyPage] = outletContext.PageState;
  const [preview, setPreview] = useState(false);

  return(
    <>
    {preview
    ?(
      <ViewPage PageState={[myPage, setMyPage]} previewToggleButton={<PreviewToggleButton PreviewState={[preview, setPreview]}/>}/>
    )
    :(
      <div className="m-3 flex justify-center">
        <div className="text-accent bg-dark rounded-md p-3 m-3 max-w-full w-fit self-center shadow-md min-w-1/2">
          <div className="flex justify-between">
            <PreviewToggleButton PreviewState={[preview, setPreview]}/>
            <Link to="../../edit">Go To Journey</Link>
          </div>
          <EditPageTitlecard PageState={[myPage, setMyPage]}/>
          <div>{
            myPage.sections.map((it, index) =>{
              return(
                <EditSection key={index} PageState={[myPage, setMyPage]} index={index} />
              )
            })
          }</div>
          <div className="flex justify-center">
            <button className="bg-soft p-0.5 h-fit rounded-md"
              onClick={()=>{
                let newState = {...myPage};
                newState.sections.push(new JourneySection("", "", "", []));
                setMyPage(newState);
              }}
            >Add New Section</button>

          </div>
        </div>
      </div>
    )}
    </>
  )

}

export function ViewJourneyCard(props){
  const myJourneyCard = props.JourneyCardInfo;

  var authorString = "";
  if(myJourneyCard.authors.length === 1) authorString="anonymous";
  else{
    authorString=myJourneyCard.authors[0];
    for(let i=1;i<myJourneyCard.authors.length;++i){
      if(myJourneyCard.authors[i]=="") continue;
      authorString = authorString+", "+myJourney.authors[i];
    }
  }

  var editorString = "";
  if(myJourneyCard.editors.length>0){
    editorString=myJourneyCard.editors[0];
    for(let i=1;i<myJourneyCard.editors.length;++i){
      if(myJourneyCard.editors[i]=="") continue;
      editorString = editorString+", "+myJourneyCard.editors[i];
    }
  } 

  return (
      <div className="bg-dark m-3 p-3 rounded-md text-accent w-full">
        {props.previewToggleButton}
        <Link to={`/journey/${myJourneyCard.id}`} className="w-full">
          <div className="mb-1 text-xs w-full">
            <h1 className="text-contrast font-bold text-2xl">{myJourneyCard.title}</h1>
            <p className="inline"> written by {authorString} </p>
            {editorString != "" && <p className="inline-block">and edited by {editorString}</p>}
          </div> 
          {myJourneyCard.description != "" &&
          <div className="bg-soft p-2 rounded-md">
            <span className="text-md">{JSXFromMarkdown(myJourneyCard.description)}</span>
          </div>}
        </Link>
      </div>
  );
}

function EditJourneyCard(props){

  const [myJourney, setMyJourney] = props.JourneyState;
  const [preview, setPreview] = useState(false);

  var authorString = "";
  if(myJourney.authors.length===1) authorString="anonymous";
  else{
    authorString=myJourney.authors[0];
    for(let i=1;i<myJourney.authors.length;++i){
      if(myJourney.authors[i]=="") continue;
        authorString = authorString+", "+myJourney.authors[i];
    }
  }

  var editorString = "";
  if(myJourney.editors.length>0){
    editorString=myJourney.editors[0];
    for(let i=1;i<myJourney.editors.length;++i){
      if(myJourney.editors[i]=="") continue;
      editorString = editorString+", "+myJourney.editors[i];
    }
  } 

  return (
      <>
      {preview
      ? <ViewJourneyCard JourneyCardInfo={{
        title: myJourney.title,
        description: myJourney.description,
        authors: myJourney.authors,
        editors: myJourney.editors,
        id: myJourney.id,
        }} previewToggleButton={<PreviewToggleButton PreviewState={[preview, setPreview]}/>}/>
      :(
        <div className="bg-dark m-3 p-3 rounded-md text-accent w-full">
          <PreviewToggleButton PreviewState={[preview, setPreview]}/>
          <div className="mb-1 text-xs w-fit">
            <h1 className="text-contrast font-bold text-2xl">{myJourney.title}</h1>
            <p className="inline"> written by {authorString} </p>
            {editorString != "" && <p className="inline-block">and edited by {editorString}</p>}
          </div> 
          <div className="bg-soft p-2 rounded-md">
            <TextArea 
              value={myJourney.description}
              placeholder="Description"
              update={(value)=>{
                setMyJourney((prevState)=>{
                  let newJourney={...prevState};
                  newJourney.description=value;
                  return newJourney
                })
              }}
            />
          </div>
        </div>
      )}
      </>
  );
}