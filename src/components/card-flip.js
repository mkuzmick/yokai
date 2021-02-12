/** @jsx jsx */

import { useState } from "react"
import { jsx, Container } from "theme-ui"

const Click = () => (
    <div
        sx={{
            margin: "auto",
            padding: "50px"
        }}
    >
        <ClickMe />
    </div>
)

const Front = (props) => (
    <div
    sx={{
        backgroundColor: "rgba(10, 60, 175, 0.9)",
        color: "white",
        position: "absolute",
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
        overflow: "hidden"
    }}
    >
        {(props.image && <img alt="click me" src={props.image}/>) || props.text || <Click />}
    </div>
)

const Back = (props) => (
    <div
        sx={{
            backgroundColor: "dodgerblue",
            color: "white",
            transform: "rotateY(180deg)",
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            overflow: "hidden"
        }}
    >
        <Container>
            {(props.image && <img src={props.image}/>) || props.text || <Click />}
        </Container>

    </div>
)

const OuterCardContainer = (props) => (
    <div
        sx={{
            backgroundColor: "transparent",
            height: "200px",
            width: "350px",
            perspective: "1000px",
        }}
    >
        {props.children}
    </div>
)

const InnerCardContainer = (props) => (
    <div
            className="card-class"
            sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    transform: props.flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transformStyle: "preserve-3d",
                    //   bg: flipped ? `rgba(0,32, 255, 0.7)` : `rgba(255,0,53,0.9)`,
                    //   color: `white`,
                    fontFamily: `Abril Fatface`,
                    transition: "background-color 1s ease, transform .5s",
            }}
            onClick={props.onClick}
            role="button"
    >
        {props.children}
    </div>
)

const CardFlip = ({children, frontImage, backImage, frontText, backText}) => {
  const [isFlipped, setFlip] = useState(false)
  function flip() {
    console.log(`flipping from ${isFlipped} to ${!isFlipped}`)
    setFlip(!isFlipped)
  }
  return (
    <div
        sx={{
            width: "500px",
            height: "400px",
            padding: "75px"
        }}
    >
        <OuterCardContainer>
            <InnerCardContainer
                flipped={isFlipped}
                onClick={flip}
            >
                <Front
                    image={frontImage}
                    text={frontText}
                />
                <Back
                    image={backImage}
                    text={backText}
                />
                {children}
            </InnerCardContainer>
        </OuterCardContainer>
    </div>
  )
}

export default CardFlip