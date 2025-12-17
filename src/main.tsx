
/**
 * Main entry point for the React application.
 * Initializes the React root and renders the App component.
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Create and render the React application
createRoot(document.getElementById("root")!).render(<App />);
  