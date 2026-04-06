// types/partytown-react.d.ts
declare module "@builder.io/partytown/react" {
  import type { PartytownConfig } from "@builder.io/partytown";
  import type React from "react";

  export interface PartytownProps extends PartytownConfig {
    /** Activa o desactiva el modo debug de Partytown */
    debug?: boolean;
    forward?: string[];
    children?: React.ReactNode;
  }

  export const Partytown: React.FC<PartytownProps>;
}
