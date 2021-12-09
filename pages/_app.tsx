import "../styles/globals.css";
import type { AppProps } from "next/app";

import Head from "next/head";
import { Fragment } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import theme from "../styles/theme";

const queryClient = new QueryClient();
function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Head>
        <link rel="shortcut icon" href="/isolated-logo.svg" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </ThemeProvider>
    </Fragment>
  );
}

export default App;
