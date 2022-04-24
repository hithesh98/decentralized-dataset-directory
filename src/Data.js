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

        </Text>
        <Card.Footer>
          <Link target="_blank" href="https://github.com/geist-org/geist-ui">See NFT on Ethscan.</Link>
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
      <div className="ais-InstantSearch">
        <h1>React InstantSearch </h1>
        <InstantSearch indexName="ethams_demo" searchClient={searchClient}>
          <div className="right-panel">
            <SearchBox />
            <Grid.Container gap={1.5}>
            <Grid>
            <Hits hitComponent={Hit} />
            </Grid>
            </Grid.Container>
          </div>
        </InstantSearch>
      </div>
    </>)
}

export default Data