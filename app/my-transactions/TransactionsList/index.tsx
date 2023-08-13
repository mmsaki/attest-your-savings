"use client";

import { Key, Suspense } from "react";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Sorting from "../../components/Sorting";
import Icon from "../../components/Icon";
import Tabs from "../../components/Tabs";
import TablePagination from "../../components/TablePagination";
import Row from "./Row";
import {
  gql,
  useQuery,
  Client,
  Provider,
  cacheExchange,
  fetchExchange,
} from "urql";
import { useAccount } from "wagmi";

export type AttestationProps = {
  attester: string;
  blockTimestamp: string;
  id: string;
  recipient: string;
  transactionHash: string;
  uid: string;
  __typename: string;
};

// 1. GraphQL
const APIURL = "https://api.studio.thegraph.com/query/51134/safes/v0.0.1";

const query = gql`
  query {
    attesteds(first: 1000) {
      id
      recipient
      attester
      uid
      transactionHash
      blockTimestamp
      __typename
      schema
    }
  }
`;

const client = new Client({
  url: APIURL,
  exchanges: [cacheExchange, fetchExchange],
});

const TransactionsList = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // @ts-ignore
    const response = await client.query(query).toPromise();
    setData(response.data.attesteds);
    console.log("response:", response);
  }
  const [type, setType] = useState<string>("all-accounts");

  const types = [
    {
      title: "All Accounts",
      value: "all-accounts",
    },
  ];

  const { address } = useAccount();

  console.log("Active account, ", address);

  return (
    <Provider value={client}>
      <div className="flex mb-6 md:block md:mb-5">
        <Tabs
          className="mr-auto md:flex-nowrap md:overflow-auto md:-mx-5 md:scrollbar-none md:scroll-smooth md:before:w-5 md:before:shrink-0 md:after:w-5 md:after:shrink-0"
          classButton="md:ml-0"
          items={types}
          value={type}
          setValue={setType}
        />
        <button className="btn-stroke btn-small mr-1.5 lg:hidden">
          <Icon name="filters" />
          <span>Apply Filter</span>
        </button>
        <button className="btn-stroke btn-small lg:hidden">
          <Icon name="document" />
          <span>Export to CSV</span>
        </button>
      </div>
      <table className="table-custom">
        <thead>
          <tr>
            <th className="th-custom md:hidden">
              <Sorting title="Date & Time" />
            </th>
            <th className="th-custom">
              <Sorting title="Attester" />
            </th>
            <th className="th-custom lg:hidden">
              <Sorting title="Service" />
            </th>
            <th className="th-custom lg:hidden">
              <Sorting title="Fee" />
            </th>
            <th className="th-custom text-right">
              <Sorting title="Price" />
            </th>
            <th className="th-custom w-15 text-center !px-0 md:hidden"></th>
          </tr>
        </thead>
        <tbody>
          {data.map(
            (transaction: AttestationProps, index) =>
              transaction.attester.toLowerCase() === address?.toLowerCase() && (
                <Row item={transaction} key={index} />
              )
          )}
        </tbody>
      </table>
      <TablePagination />
    </Provider>
  );
};

export default TransactionsList;
