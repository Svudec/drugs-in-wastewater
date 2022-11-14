import { Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import './nestedTable.css';
const { Column, ColumnGroup } = Table;

const NestedTable = (props) => {

  return <Table dataSource={props.data || []} pagination={{pageSizeOptions: [10, 20, 50, 100]}}>
    <Column title="Godina" dataIndex='measurement_year' key='measurement_year' />
    <Column title="Metabolit" dataIndex='metabolite_name' key='metabolite_name' />
    <ColumnGroup title="Država">
      <Column title="Kod" dataIndex="country_code" key="country_code" />
      <Column title="Naziv" dataIndex="country_name" key="country_name" />
    </ColumnGroup>
    <ColumnGroup title="Grad">
      <Column title="Naziv" dataIndex="city_name" key="city_name" />
      <Column title="Populacija" dataIndex="location_population_size" key="location_population_size" />
    </ColumnGroup>
    <ColumnGroup title="Institucija">
      <Column title="Naziv" dataIndex="institution_name" key="institution_name" />
      <Column title="Web" dataIndex="institutuion_website" key="institutuion_website"
        render={url => url ? <a href={url} target="_blank" rel="noopener noreferrer">LINK</a> : <div>Nepoznato</div>} />
    </ColumnGroup>
    <ColumnGroup title="Mjerno mjesto">
      <Column title="Id" dataIndex="location_id" key="location_id" />
      <Column title="Naziv" dataIndex="location_name" key="location_name" />
      <Column title="Lokacija" dataIndex="location_latitude" key="location_latitude"
        render={(latitude, record) => <a href={`https://maps.google.com/?q=${record.location_latitude},${record.location_longitude}`} target="_blank" rel="noopener noreferrer">LINK</a>} />
    </ColumnGroup>
    <Column title="Dan u tjednu" dataIndex="measurement_dayofweek" key="measurement_dayofweek" />
    <Column title="Koncentracija" dataIndex="measurement_value" key="measurement_value" />
  </Table>
};
export default NestedTable;