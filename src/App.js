import React, {useEffect, useState} from 'react';
import algoliasearch from 'algoliasearch';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Configure,
  DynamicWidgets,
  RefinementList,
  ToggleRefinement,
  Pagination,
  Panel,
  Index,
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './App.css';
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, CustomChainConfig, ADAPTER_EVENTS } from "@web3auth/base";
import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";
import Homepage from './Homepage';
import Datapage from './Data';
import { GeistProvider, CssBaseline, Button, Grid, Modal, Input, Spacer, Textarea, Note } from '@geist-ui/core' 
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ethers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider'
import PlayFill from '@geist-ui/icons/playFill'

const searchClient = algoliasearch(
  '259LC4EB80',
  'bb760050b204bd155fba3360dba371bd'
);

const loading = (
<p>loading...</p>
)


const ethChainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x38",
    rpcTarget: `https://bsc-dataseed.binance.org/`,
    displayName: "BNB Smart Chain Testnet",
    blockExplorer: "https://testnet.bscscan.com/",
    ticker: "BSC",
    tickerName: "Binance smart something",
};
// We are initializing with EIP155 namespace which
// will initialize the modal with ethereum mainnet
// by default.
const web3auth = new Web3Auth({
    chainConfig: ethChainConfig,
    clientId: "BEDseX2NBva34O0nEWD5GGmjCyfNVv_w90aUyun3qGE0Caf4LzqaIIGspVdD4aNSZ33d_IYPljrmJhFDbPZ4IEU" // get your clientId from https://developer.web3auth.io
});




function App() {
  const [data, setdata] = useState({
    address: "",
    Balance: null,
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [state, setState] = useState(false)
  const handler = () => setState(true)
  const closeHandler = (event) => {
    setState(false)
    console.log('closed')
  }

  const [cid, setCid] = useState(null)
  const [jsonData, setJsonData] = useState(null)
  const [modalNote, setModalNote] = useState({
    hidden: true,
    status: "success",
    description: "description"
  })

  const detectWeb3Auth = () => {
    return web3auth.provider
  }

  function subscribeAuthEvents(web3auth) {
    web3auth.on(ADAPTER_EVENTS.CONNECTED, (data) => {
      console.log("Yeah!, you are successfully logged in", data);
    });
  
    web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
      console.log("connecting");
    });
  
    web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
      console.log("disconnected");
      let a = detectWeb3Auth().then((input) => setAuthenticated(input))
  
    });
  
    web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
      console.log("some error or user have cancelled login request", error);
    });
  
    web3auth.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, (isVisible) => {
      console.log("modal visibility", isVisible);
    });
  }
  
  const initWallet = async () => {
    console.log("emitting")
    await web3auth.initModal();
    
      }

  const openProvider = async () => {
    console.log("opening")
    await web3auth.connect();
  }

  const logout = async () => {
    console.log("logging out")
    await web3auth.logout();
    let a = detectWeb3Auth() 
    console.log(a)
  }

  const login = async () => {
    console.log("logging out")
    openProvider().then(() => getLoginStatus().then((input) => setAuthenticated(input)));
  }

  const getLoginStatus = async () => {
    let a = detectWeb3Auth() 
    return a;
  }

  subscribeAuthEvents(web3auth);

  useEffect(() => {
    let initiatedWallet = initWallet().then(() => getLoginStatus().then((input) => setAuthenticated(input)))
  }, [])

  const executeBridge = () => {
    console.log(jsonData)
    const data = JSON.parse(jsonData)
    const indexed = [{
      ...data,
      cid: cid 
    }]
    console.log(indexed)
    //upload algolia
    const index = searchClient.initIndex('ethams_demo')
    

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: JSON.stringify(indexed)
    }).then(response=>response.json())
    .then(data=>{ 
      fetch('https://api-eu1.tatum.io/v3/nft/mint', {
        method: 'POST',
        headers: {
          "x-api-key": "b8ad1e1c-ba3f-45b7-8b12-1a74f68e9dd6",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "chain": "BSC",
          "to": "0x20cF6F904526Df3dC458B621D0734fafef1928aF",
          "url": data.ipfsHash,
          "feeCurrency": "BSC"
       
        })
      }).then(response=>response.json()).then(data=>{
        setModalNote({hidden: false,
          status: "success",
          description: `Minted NFT, your txid is ${data.txId}`
        }
      )
      const temp = indexed[0]
      const indexed2 = [{
        ...temp,
        txId: data.txId 
      }]
  
      let result = index.saveObjects(indexed2, {
        autoGenerateObjectIDIfNotExist: true
      }).then(i => console.log(i))
  
        
      }); })
    
    
      }

  return (
    <>

  <GeistProvider>
    <CssBaseline />
    <div className="header">
      <div style={{display: "flex"}}>
      <h1 className="header-title">
          <a href="/">IPFS Datasets</a>
      </h1>
      </div>
        <div style={{padding: "0 30px;", display: "flex"}}>
          {authenticated? <><div><Button auto type="primary" style={{marginRight: 5}}>Connected</Button><Button auto type="secondary" auto onClick={handler}>Pin Metadata</Button></div></>:<Button onClick={login} auto type="secondary">Connect wallet</Button>}
        </div>
      </div>
      <Modal visible={state} onClose={closeHandler}>
        <Modal.Title>Bridge IPFS Data with Metadata</Modal.Title>
        <Modal.Subtitle></Modal.Subtitle>
        <Modal.Content>
          <p>Paste your IPFS Hash (CID) below, then add some metadata about the file contents.</p>

        </Modal.Content>
        <Input scale={2/3} placeholder="IPFS Hash (CID) like ipfs://Qj4..." width="100%" onChange={(e) => setCid(e.target.value)}/> <Spacer h={.5} />

        <Textarea style={{height:"80px"}} placeholder="Paste your JSON metadata here" onChange={(e) => setJsonData(e.target.value)} />
        <Spacer></Spacer>

        <Button icon={<PlayFill />} scale={2/3} type="secondary">Validate JSON</Button>
        {modalNote.hidden? "": <br></br>}
  <Note hidden={modalNote.hidden} type="success" label={modalNote.status} filled>{modalNote.description}</Note>

        <Modal.Action passive onClick={() => setState(false)}>Cancel</Modal.Action>
        <Modal.Action onClick={executeBridge}>Execute</Modal.Action>
      </Modal>
      <HashRouter>
      <Switch>

      
        <Route exact path="/login">
          <Redirect to="/" />
        </Route>
        <Route path="/id/:hash" name="Data" render={props => <Datapage {...props} searchClient={searchClient} logout={logout}/>} />
        <Route path="/" name="Home" render={props => <Datapage {...props} searchClient={searchClient} logout={logout}/>} />
      </Switch>

      </HashRouter> 
   </GeistProvider>

    </>

  );
}


export default App;
