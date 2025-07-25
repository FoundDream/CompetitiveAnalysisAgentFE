import React from "react";
import Navigation from "./src/components/Navigation";
import { CompareProvider } from "./src/store/CompareStore";

export default function App() {
  return (
    <CompareProvider>
      <Navigation />
    </CompareProvider>
  );
}
