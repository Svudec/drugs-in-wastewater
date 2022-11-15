import './App.css';
import { Typography, Select, Input, Button, Tabs } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import NestedTable from './NestedTable';
import Fuse from 'fuse.js';
import About from './About';
import { CSVLink } from 'react-csv';

const { Title } = Typography;

const filterSectors = {
  'all': { value: 'all', label: 'Sva polja (wildcard)', keys: ['measurement_year', 'metabolite_name', "country_code", "country_name", "city_name", "location_population_size", "institution_name", "location_id", "location_name", "measurement_dayofweek", "measurement_value"] },
  'measurement_year': { value: 'measurement_year', label: 'Godina mjerenja', keys: ['measurement_year'] },
  'metabolite_name': { value: 'metabolite_name', label: 'Metabolit', keys: ['metabolite_name'] },
  'country_code': { value: 'country_code', label: 'Kod države', keys: ['country_code'] },
  'country_name': { value: 'country_name', label: 'Naziv države', keys: ['country_name'] },
  'city_name': { value: 'city_name', label: 'Naziv grada', keys: ['city_name'] },
  'location_population_size': { value: 'location_population_size', label: 'Populacija', keys: ['location_population_size'] },
  'institution_name': { value: 'institution_name', label: 'Naziv institucije', keys: ['institution_name'] },
  'location_id': { value: 'location_id', label: 'Id mjernog mjesta', keys: ['location_id'] },
  'location_name': { value: 'location_name', label: 'Naziv mjernog mjesta', keys: ['location_name'] },
  'measurement_dayofweek': { value: 'measurement_dayofweek', label: 'Dan u tjednu', keys: ['measurement_dayofweek'] },
  'measurement_value': { value: 'measurement_value', label: 'Koncentracija metaboilita', keys: ['measurement_value'] }
}

const fusifySearchQuery = searchQuery => searchQuery.split(' ').reduce((accum, el) => accum + ` '${el}`, '')

function App() {

  const [data, setData] = useState([])
  const [searchResults, setSearchResults] = useState(null)
  const [filterSector, setFilterSector] = useState('all')
  const [searchString, setSearchString] = useState('')
  const fuse = useRef(null)

  useEffect(() => {
    fetch('http://localhost:8400/').then(res => res.json().then(parsed => setData(parsed)))
  }, [])

  useEffect(() => {
    fuse.current = new Fuse(data, {
      shouldSort: true,
      findAllMatches: false,
      ignoreLocation: true,
      location: 0,
      distance: 100,
      minMatchCharLength: 2,
      threshold: 0.3,
      useExtendedSearch: true,
      keys: filterSectors[filterSector].keys
    })

  }, [data, filterSector])

  const search = () => {
    const query = fusifySearchQuery(searchString)

    const results = fuse.current?.search(query)
    setSearchResults(results.map(r => r.item))
  }

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(searchResults || data))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "drugs_in_wastewater.json";

    link.click();
  };

  return (
    <div className="container">
      <div className='header'>
        <Title>Prisutnost narkotika u otpadnim vodama nekih europskih gradova</Title>
      </div>
      <Tabs defaultActiveKey='1' destroyInactiveTabPane size='big'>
        <Tabs.TabPane key={1} tab='O podacima'>
          <About />
        </Tabs.TabPane>
        <Tabs.TabPane key={2} tab='Tablica'>
          <div className='content'>
            <div className='search-container'>
              <Select value={filterSector} options={Object.values(filterSectors)} style={{ width: '350px' }} onSelect={(v, option) => setFilterSector(option.value)} />
              <Input placeholder='Pretraga' value={searchString} onChange={(v) => setSearchString(v.target.value)} />
              <Button type='primary' onClick={search}>Traži</Button>
              {searchResults && <Button type='secondary' onClick={() => setSearchResults(null)}>Reset filtera</Button>}
              <Button type='primary' onClick={exportData}>Preuzmi JSON</Button>
              <CSVLink data={searchResults || data} filename='drugs_in_wastewater'>Preuzmi CSV</CSVLink>
            </div>
            <NestedTable data={searchResults ? searchResults : data} />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane key={3} tab={'Strojno čitljivo'}>
        <div className='content'>
          <a href='/drugs-in-wastewater.csv' download>CSV datoteka</a>
          <a href='/drugs-in-wastewater.json' download>JSON datoteka</a>
        </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default App;
