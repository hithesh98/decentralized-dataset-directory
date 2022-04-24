import React, {useEffect, useState} from 'react';
import algoliasearch from 'algoliasearch/lite';
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
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './App.css';
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, CustomChainConfig, ADAPTER_EVENTS } from "@web3auth/base";
import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";
import Homepage from './Homepage';
import Datapage from './Data';
import { GeistProvider, CssBaseline, Button, Grid } from '@geist-ui/core' 
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ethers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider'


const searchClient = algoliasearch(
  '5JP0CIZK3A',
  '878d4c6fc08b0b0a88ff59908e1bd020'
);

const loading = (
<p>loading...</p>
)


const ethChainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x3",
    rpcTarget: `https://eth-ropsten.alchemyapi.io/v2/-Yy8rh82I58laI0uyHmi3-1yPSX2Qj8-`,
    displayName: "ropsten",
    blockExplorer: "https://ropsten.etherscan.io/",
    ticker: "ETH",
    tickerName: "Ethereum",
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
  const [visible, setVisible] = useState(false);
  

  function subscribeAuthEvents(web3auth) {
    web3auth.on(ADAPTER_EVENTS.CONNECTED, (data) => {
      console.log("Yeah!, you are successfully logged in", data);
    });
  
    web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
      console.log("connecting");
    });
  
    web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
      console.log("disconnected");
      let a = detectEthereumProvider().then((input) => console.log(input))
  
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
    let a = await detectEthereumProvider() 
    console.log(a)
  }

  const login = async () => {
    console.log("logging out")
    openProvider().then(() => getLoginStatus().then((input) => setAuthenticated(input)));
  }

  const getLoginStatus = async () => {
    let a = await detectEthereumProvider() 
    return a;
  }

  subscribeAuthEvents(web3auth);

  useEffect(() => {
    let initiatedWallet = initWallet().then(() => getLoginStatus().then((input) => setAuthenticated(input)))
  }, [])

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
          {authenticated? <div><Button auto type="primary" style={{marginRight: 5}}>Connected</Button><Button auto type="secondary" auto onClick={() => setVisible(true)}>Pin Metadata</Button></div>:<Button onClick={login} auto type="secondary">Connect wallet</Button>}
        </div>
      </div>
      <HashRouter>
      <Switch>
        <Route exact path="/login">
          <Redirect to="/" />
        </Route>
        <Route path="/id/:hash" name="Data" render={props => <Datapage {...props} searchClient={searchClient} logout={logout}/>} />
        <Route path="/" name="Home" render={props => <Homepage {...props} searchClient={searchClient} logout={logout}/>} />
      </Switch>

      </HashRouter> 
   </GeistProvider>

    </>

  );
}


export default App;
