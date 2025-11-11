declare module "react-simple-maps" {
  interface Geography {
    rsmKey: string;
    properties: {
      ISO_A3: string;
      [key: string]: any;
    };
  }

  interface GeographiesProps {
    geographies: Geography[];
  }

  interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
    };
    style?: React.CSSProperties;
    children: React.ReactNode;
  }

  interface GeographiesComponentProps {
    geography: string;
    children: (props: GeographiesProps) => React.ReactNode;
  }

  interface GeographyProps {
    key: string;
    geography: Geography;
    onClick?: () => void;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geographies: React.FC<GeographiesComponentProps>;
  export const Geography: React.FC<GeographyProps>;
}
