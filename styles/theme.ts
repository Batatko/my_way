import { createTheme } from "@mui/material";


const theme = createTheme({
    palette: {
      primary: {
        light: '#5ddef4',
        main: '#00acc1',
        dark: '#007c91',
        contrastText: '#000000',
      },
      secondary: {
        light: '#e5ffff',
        main: '#b2ebf2',
        dark: '#81b9bf',
        contrastText: '#000000',
      },
      background: {
        default: "#d2fcfc",
      },
    },
    typography: {
        fontFamily: 'Quicksand',
        fontWeightLight: 400,
        fontWeightRegular: 500,
        fontWeightMedium: 600,
        fontWeightBold: 700,
    },

  });

export default theme;