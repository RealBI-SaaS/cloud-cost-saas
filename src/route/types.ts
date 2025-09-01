import { ReactElement } from "react";

export interface AppRoute {
  path: string;
  element: ReactElement;
  children?: AppRoute[];
}