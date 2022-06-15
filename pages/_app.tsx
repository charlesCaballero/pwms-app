import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { yellow } from "@mui/material/colors";
// import Nunito from "@styles/fonts/Nunito/Nunito-VariableFont_wght.ttf";

// import '../assets/fontawesome-pro.css';
// import '../assets/main.scss';
// import '../assets/tailwind.css';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const queryClient = new QueryClient();

  const theme = createTheme({
    palette: {
      primary: {
        main: "#027e42",
        light: "#19a15a",
        dark: "#005f2e",
      },
      secondary: yellow,
      background: {
        default: "#fafafa",
      },
    },
    typography: {
      fontFamily: "Nunito",
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Head>
          <title>iClique</title>
          <link rel="shortcut icon" href="/favicon.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@500&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
