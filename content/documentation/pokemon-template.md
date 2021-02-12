import React from 'react'
import { graphql } from 'gatsby'

export default ({ data }) => {

    return (
    <div>
        <pre>{JSON.stringify(data, null, 4)}</pre>
        <h1>{data.airtable.data.Name}</h1>
        <img src={data.airtable.data.Sprites[0].url} />
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
            Name
            APIURL
            Height
            Base_Experience
            Weight
            HP
            Attack
            Defense
            Speed
            Special_Defense
            Special_Attack
            Description
            ID
            Updated
            TimeDiff
            Sprites {
            url
            }
        }
    }
}`