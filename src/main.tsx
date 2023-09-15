import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { LightNodeProvider, ContentPairProvider } from "@waku/react";
import { Protocols } from "@waku/sdk";
import "./index.css";

window.global = globalThis;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LightNodeProvider
      protocols={[Protocols.Store, Protocols.Filter, Protocols.LightPush]}
      options={{ defaultBootstrap: true }}
    >
      <ContentPairProvider
        contentTopic={import.meta.env.REACT_APP_MEME_CONTENT_TOPIC}
      >
        <App />
      </ContentPairProvider>
    </LightNodeProvider>
  </React.StrictMode>
);
