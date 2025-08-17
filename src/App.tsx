import React from "react";

import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Layout from "./components/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/heroes" replace />} />
          {/* <Route path="/heroes" element={<SuperheroList />} />
          <Route path="/heroes/new" element={<SuperheroForm />} />
          <Route path="/heroes/:id" element={<SuperheroDetails />} />
          <Route path="/heroes/:id/edit" element={<SuperheroForm />} /> */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
