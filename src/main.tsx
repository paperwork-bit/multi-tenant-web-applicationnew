
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/globals.css";
import { ensureCloudSync } from "./lib/cloudflareSync";

async function bootstrap() {
  await ensureCloudSync();
  createRoot(document.getElementById("root")!).render(<App />);
}

void bootstrap();
  