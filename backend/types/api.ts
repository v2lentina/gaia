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
  translations?: Partial<
    Record<
      TranslationKey,
      {
        common: string;
        official: string;
      }
    >
  >;
}

/*
export interface CountryDetails extends Country {
  region: string;
  subregion: string;
  population: number;
  capital: string[];
  languages: {
    [key: string]: string; //enum
  };
}*/

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
