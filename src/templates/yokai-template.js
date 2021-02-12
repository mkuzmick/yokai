/** @jsx jsx */
import { jsx } from 'theme-ui'
import YokaiFlip from "../components/yokai-flip.js"



export default ({ data }) => {

    return (
    <div
      sx={{
        width: "80%",
        margin: "auto",
        padding: "3em",
      }}
    >
      <div
      sx={{
        width: "100%",
        textAlign: "center"
      }}
      >
        <h1
          sx={{
            fontFamily: "Avenir Next, sans-serif",
            fontWeight: "900",
            fontSize: "4em"
          }}
        >{data.airtable.data.Name}</h1>
      </div>
        <YokaiFlip 
            front={ data.airtable.data.canvaCardFront ? data.airtable.data.canvaCardFront[0].thumbnails.large.url : data.airtable.data.cleanImageJPG ? data.airtable.data.cleanImageJPG[0].thumbnails.full.url : "/_images/gatsby.jpg"} 
            back= { data.airtable.data.canvaCardBack ? data.airtable.data.canvaCardBack[0].thumbnails.large.url : data.airtable.data.cleanImageJPG ? data.airtable.data.cleanImageJPG[0].thumbnails.full.url : "/_images/gatsby.jpg"} 
        />
        <div
            sx={{
                height: "300px"
            }}
        ></div>
        <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
    )
}

export const query = graphql`
query GetRecord($recordId: String!){
    airtable(recordId: { eq: $recordId}) {
        id
        table
        recordId
        data {
            Description
          mainFeature
          Creator
          Link_to_Project
          secondFeature
          Name
          weight
          type
          mainAttack
          region
          specialAttack
          height
          backgroundColor
          foregroundColor
          canvaCardLink
          canvaCardBack {
            id
            thumbnails {
              large {
                url
                width
                height
              }
            }
          }
          canvaCardFront {
            id
            thumbnails {
              large {
                url
                width
                height
              }
            }
          }
          cleanImageJPG {
            thumbnails {
              full {
                url
              }
            }
          }
        }
    }
}`