/** @jsx jsx */
import { jsx } from 'theme-ui'
import {useState} from "react"
import Overlay from "./overlay.js"


const Card = (props)=>{
  // const [isFlipped, setFlip]=useState(false)
  // function flip(){
  //   setFlip(!isFlipped)
  // }
  return(
    <div
      style={{
        margin:"auto",
        width:"500px",
        height:"700px",
        borderRadius:"10px",
      }}
    >
    {props.children}
    </div>
  )
}

const Inner = (props)=>{
  const [isFlipped, setFlip]=useState(false)
  function flip(){
    setFlip(!isFlipped)
  }
  return(
    <div
    style={{
      position:"relative",
      width:"100%",
      height:"100%",
      textAlign:"center",
      transition:"transform 0.8s",
      transformStyle: "preserve-3d",
      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
    }}
    onClick={flip}
    >
    {props.children}
    </div>
  )
}

const Back = (props)=>{
  return(
    <div
      style={{
        margin:"auto",
        width:"100%",
        height:"100%",
        borderRadius:"10px",
        backgroundColor:"rgba(255, 255, 255, 1)",
        position: "absolute",
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
      }}
    >
    {props.children}
    </div>
  )
}

const Front = (props)=>{
  return(
    <div
      style={{
        width:"100%",
        height:"100%",
        borderRadius:"10px",
        position: "absolute",
        backfaceVisibility: "hidden",
      }}
    >
    <img
      src={props.image}
      style={{
        borderRadius:"10px",
        width:"500px"
      }}
    />
    </div>
  )
}



const Flip = (props)=>{
  return(
    <div>

    <Card>
    <Inner>
      {/* <Overlay option="sparkle"/> */}
      <Front image={props.image}
        />
      <Back>
        <h1
        style={{
          color:"white",
        }}
        >Text</h1>
      </Back>
    </Inner>
    </Card>
    </div>
  )
}

export default Flip
