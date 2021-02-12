/** @jsx jsx */
import { jsx } from 'theme-ui'

const options = {
  sparkle: "https://media.giphy.com/media/xT9IgjNENUaf4ypqBa/source.gif",
  camcorder: "https://media.giphy.com/media/M9TkCyqLH2QcN44OaO/source.gif",
  rocket: "https://media.giphy.com/media/ZbIFfqHXhKNYW7omJc/source.gif",
  snow: "https://media.giphy.com/media/3ohs7T1ljes6v7EdFe/source.gif",
  glitch: "https://media.giphy.com/media/duif4luS2QqrYv9bZ5/source.gif",
  glitterbomb: "https://media.giphy.com/media/uV6ZueyzR8J6pCdxtZ/source.gif",
  bam: "https://media.giphy.com/media/VzHlmpgiPNub5Vypie/source.gif",
  flipit: "https://media.giphy.com/media/jVO5Cyl8OlYJoWBtqj/source.gif",
}


const Overlay = (props)=>{
  return(
    <div
      sx={{
        width:"100%",
        height:"100%",
        borderRadius:"10px",
        position: "absolute",
        zIndex: "1",
        backfaceVisibility: "hidden",
        opacity:"0",
        ':hover': {
        opacity: "1",
      },
      }}

    >
    <img
      src={options[props.option || "sparkle"]}
      style={{
        borderRadius:"10px",
        width:"100%"
      }}
    />
    </div>
  )
}

export default Overlay
