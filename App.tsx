import React from "react";
import Navigation from "./src/components/Navigation";
import { CompareProvider } from "./src/store/CompareStore";
import { TaskProvider } from "./src/store/TaskStore";

export default function App() {
  return (
    <TaskProvider>
      <CompareProvider>
        <Navigation />
      </CompareProvider>
    </TaskProvider>
  );
}
