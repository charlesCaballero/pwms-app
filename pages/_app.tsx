import Head from "next/head";
import { FC, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { createTheme, ThemeProvider } from "@mui/material/styles";
<<<<<<< HEAD
=======
import { yellow } from "@mui/material/colors";
>>>>>>> 7d72df272bd091455348f46a566f25d3ed838983
import { useRouter } from "next/router";
import "@fontsource/inter/variable-full.css";
import FavIcon from "@assets/images/pwms-logo-alt-2.png";
import dynamic from "next/dynamic";
import Loading from "@components/Loader/Loading";
import { AppProps } from "next/app";
<<<<<<< HEAD
import { yellow } from "@mui/material/colors";

const AppLayout = dynamic(() => import("@components/Layouts/AppLayout"), {
=======

const AppLayout = dynamic(() => import("@components/layouts/AppLayout"), {
>>>>>>> 7d72df272bd091455348f46a566f25d3ed838983
  suspense: true,
});

// Client-side cache, shared for the whole session of the user in the browser.

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const queryClient = new QueryClient();
  const router = useRouter();
  const pathName = router.pathname;

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
      fontFamily: "Inter, sans-serif",
      // fontFamily: "Nunito, sans-serif",
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Head>
          <title>PWMS</title>
          <link rel="shortcut icon" href={FavIcon.src} />
        </Head>
        {pathName.includes("auth") ||
        pathName.includes("error") ||
        pathName === "/" ? (
<<<<<<< HEAD
          <Component {...pageProps} id={"root"} />
        ) : (
          <Suspense fallback={<Loading isOpen />}>
            <AppLayout>
              <Component {...pageProps} id={"root"} />
=======
          <Component {...pageProps} />
        ) : (
          <Suspense fallback={<Loading isOpen />}>
            <AppLayout>
              <Component {...pageProps} />
>>>>>>> 7d72df272bd091455348f46a566f25d3ed838983
            </AppLayout>
          </Suspense>
        )}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
