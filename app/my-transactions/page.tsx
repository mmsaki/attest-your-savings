import React from "react";
import Layout from "../components/Layout";
import TransactionsList from "./TransactionsList";

const page = () => {
  return (
    <Layout title="My Transactions">
      <TransactionsList />
    </Layout>
  );
};

export default page;
