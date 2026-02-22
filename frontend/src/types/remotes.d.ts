// Type declarations for Remote Module (Module Federation)
declare module "weatherRemote/WeatherApp" {
  import { ComponentType } from "react";

  interface WeatherAppProps {
    city?: string;
    lat?: number;
    lon?: number;
  }

  const WeatherApp: ComponentType<WeatherAppProps>;
  export default WeatherApp;
}
