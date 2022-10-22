import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { DefaultSession } from "./services/session";
import { DefaultClient } from "./services/client";

// FIXME: StrictMode not introduced due to:
// https://github.com/atlassian/react-beautiful-dnd/issues/2396

async function main() {
  DefaultSession.registerInvalidSessionHandler();
  DefaultClient.registerAlertForErrors();

  ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
  DefaultSession.tryBootstrap();
}

main().catch((err) => {
  console.error(err);
});
