import React from 'react';
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

const searchClient = algoliasearch(
  '5JP0CIZK3A',
  '878d4c6fc08b0b0a88ff59908e1bd020'
);

function App() {
  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <a href="/">IPFS Datasets</a>
        </h1>
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
