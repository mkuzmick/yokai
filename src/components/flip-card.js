/** @jsx jsx */
import { jsx } from 'theme-ui'


const FlippingCard=(props)=>{
    return (
        <div>
            {props.front}
            {props.back}
        </div>
    )
}
export default FlippingCard