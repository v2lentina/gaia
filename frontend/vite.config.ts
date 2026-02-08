import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  const weatherRemoteUrl = isDev
    ? "http://localhost:3001/assets/remoteEntry.js"
    : "https://v2lentina.github.io/WeatherApi/assets/remoteEntry.js";

  return {
    base: "/gaia/",
    plugins: [
      react(),
      federation({
        name: "gaiaHost",
        remotes: {
          weatherRemote: weatherRemoteUrl,
        },
        shared: ["react", "react-dom"],
      }),
    ],
    build: {
      modulePreload: false,
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
    },
  };
});
