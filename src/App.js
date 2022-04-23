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

const searchClient = algoliasearch(
  '5JP0CIZK3A',
  '878d4c6fc08b0b0a88ff59908e1bd020'
);


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
  function subscribeAuthEvents(web3auth) {
    web3auth.on(ADAPTER_EVENTS.CONNECTED, (data) => {
      console.log("Yeah!, you are successfully logged in", data);

      const timer = setTimeout(async () => {
        await web3auth.logout();
      }, 30000);
    
    });
  
    web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
      console.log("connecting");
    });
  
    web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
      console.log("disconnected");
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
  }


  subscribeAuthEvents(web3auth);
  initWallet().then(() => openProvider())

  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <a href="/">IPFS Datasets</a>
        </h1>
        <button onClick={logout}>Log out</button>
      </header>

      <div className="container">
        <InstantSearch searchClient={searchClient} indexName="ai_datasets">
          <div className="search-panel">
            <div className="search-panel__filters">
              <Configure facets={['*']} maxValuesPerFacet={20} />
              <DynamicWidgets fallbackWidget={RefinementList}></DynamicWidgets>
            </div>

             <div className="search-panel__results">
              <h1 className="search-title">
                Curated list of datasets for data scientists
              </h1>
              <SearchBox
                className="searchbox"
                translations={{
                  placeholder: '',
                }}
              />
              <Panel header="Visibility">
                <ToggleRefinement
                  attribute="public"
                  label="Public"
                  value={true}
                  defaultRefinement={true}
                />
              </Panel>

              <Panel header="Licenses">
                <RefinementList attribute="license" />
              </Panel>

              <Panel header="Tags">
                <RefinementList attribute="tags" />
              </Panel>
              <Hits hitComponent={Hit} />

              <div className="pagination">
                <Pagination />
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}

function Hit(props) {
  return (
    <article className="hit">
      <h2>{props.hit.name}</h2>
      <p>{JSON.stringify(props.hit.description).slice(0, 200)}</p>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;
