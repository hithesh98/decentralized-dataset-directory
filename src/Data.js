import React, {useEffect, useState} from 'react';
import {
    InstantSearch,
    Hits,
    SearchBox,
  } from 'react-instantsearch-dom';
  import algoliasearch from 'algoliasearch';

  import { GeistProvider, CssBaseline, Button, Modal, Input, Spacer, Textarea, Note, Card,Text, Grid, Link } from '@geist-ui/core' 

function Hit(props){
    console.log(props)

    return(
        <Card width="100%" type="dark">
        <Text h4 my={0}>{props.hit.title || "Untitled"}</Text>
        <Text>
            {
                Object.entries(props.hit).filter(([key, value]) => !key.startsWith("_")).map(([key,value])=>{
                    return (
                        <div>{key} : {value.toString()}</div>
                    );
                  })
                  
            }
        </Text>
        <Card.Footer>
          {props.hit.txId ? <Link target="_blank" href={"https://ropsten.etherscan.io/tx/" + props.hit.txId}>See NFT on Ethscan.</Link>: <Link target="_blank" href="https://ropsten.etherscan.io/tx/">See NFT on Ethscan.</Link>}
        </Card.Footer>
      </Card>
  
    )
}
  
function Data(props){
    const searchClient = algoliasearch(
        '259LC4EB80',
        'bb760050b204bd155fba3360dba371bd'
      );
      
    return (<>
      <div className="ais-InstantSearch" style={{padding: "30px 30px 30px 60px"}}>
        <h1>Known IPFS Datasets</h1>
        <InstantSearch indexName="ethams_demo" searchClient={searchClient}>
          <div className="right-panel">
            <SearchBox />
            <br></br>

            <Hits hitComponent={Hit} />
          </div>
        </InstantSearch>
      </div>
    </>)
}

export default Data