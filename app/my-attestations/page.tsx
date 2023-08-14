import React from "react";
import Layout from "../components/Layout";
import TransactionsList from "./TransactionsList";

const page = () => {
  return (
    <Layout title="My Attestations">
      <TransactionsList />
    </Layout>
  );
};

export default page;
