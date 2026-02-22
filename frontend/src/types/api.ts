// API Response Types
export interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    svg: string;
    png: string;
  };
  cca3: string;
}

// REST Countries API
export interface RestCountriesData extends Country {
  capital?: string[];
  population?: number;
  area?: number;
  region?: string;
  subregion?: string;
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol?: string } };
  timezones?: string[];
  borders?: string[];
  continents?: string[];
  coatOfArms?: { svg?: string; png?: string };
  landlocked?: boolean;
  independent?: boolean;
  unMember?: boolean;
}

// WikiData API
export interface WikipediaImage {
  title: string;
  file_description_url: string;
  preferred: {
    mediatype: string;
    size?: number;
    width: number;
    height: number;
    url: string;
  };
  original: {
    mediatype: string;
    size?: number;
    width: number;
    height: number;
    url: string;
  };
}

export interface WikiDataFields {
  religions?: string[];
  ethnicGroups?: string[];
  governmentType?: string;
  hdi?: number;
  gdpPerCapita?: number;
  lifeExpectancy?: number;
  literacyRate?: number;
  enwikiTitle?: string;
  images?: WikipediaImage[];
}

export interface CountryDetails extends RestCountriesData {
  wikiData?: WikiDataFields; // Optional in case API call fails
}

export interface SummaryResponse {
  query: string;
  summary: string;
  fromCache: boolean;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Discriminated Union
export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: ApiError;
    };

// Union of string literals instead of enum
export type TranslationKey =
  | "ara"
  | "bre"
  | "ces"
  | "cym"
  | "deu"
  | "est"
  | "fin"
  | "fra"
  | "hrv"
  | "hun"
  | "ind"
  | "ita"
  | "jpn"
  | "kor"
  | "nld"
  | "per"
  | "pol"
  | "por"
  | "rus"
  | "slk"
  | "spa"
  | "srp"
  | "swe"
  | "tur"
  | "urd"
  | "zho";
