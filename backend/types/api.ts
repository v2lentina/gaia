// API Response Types used in both Frontend and Backend
export interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    svg: string;
    png: string;
  };
  translations?: {
    [key: string]: {
      common: string;
      official: string;
    };
  };
}

export interface CountryDetails extends Country {
  region: string;
  subregion: string;
  population: number;
  capital: string[];
  languages: {
    [key: string]: string;
  };
}
