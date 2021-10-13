// import { createMuiTheme } from "@material-ui/core/styles";
import { createTheme as createMuiTheme } from "@material-ui/core/styles";

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#4F709B",
    },
    secondary: {
      main: "#2B8AE7",
    },
    error: {
      main: "#DC004E",
    },
    background: {
      default: "#fff",
    },
    grey: {
      "500": "#999",
      "600": "#666",
      "800": "#333",
    },
  },
  typography: {
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontFamily: "Noto Sans SC",
  },
  breakpoints: {
    values: {
      xs: 600,
      sm: 750,
      md: 960,
      lg: 1200,
      xl: 1920,
    },
  },
});

export default theme;
