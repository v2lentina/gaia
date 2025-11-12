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
export interface WikiDataFields {
  religions?: string[];
  ethnicGroups?: string[];
  governmentType?: string;
  hdi?: number;
  gdpPerCapita?: number;
  lifeExpectancy?: number;
  literacyRate?: number;
}

export interface CountryDetails extends RestCountriesData {
  wikiData?: WikiDataFields; // Optional in case API call fails
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode: number;
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
