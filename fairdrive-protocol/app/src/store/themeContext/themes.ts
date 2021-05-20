import { typography, Typography } from "./typography";

export interface Theme {
  name: string;
  textColor: string;
  background1: string;
  backgroundShade: string;
  background2: string;
  typography: Typography;
}

export const themes = {
  dark: {
    name: "dark",
    textColor: "#16181D",
    background1: "#88898E",
    backgroundShade: "#CED0DD",
    background2: "#EEF0FF",
    typography,
  },
  light: {
    name: "light",
    textColor: "#16181D",
    background1: "#CED0DD",
    backgroundShade: "#EEF0FF",
    background2: "#88898E",
    typography,
  },
};
