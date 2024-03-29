import Head from "next/head";
import { FC, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import "@fontsource/inter/variable-full.css";
import dynamic from "next/dynamic";
import Loading from "@components/Loader/Loading";
import { AppProps } from "next/app";
import { yellow } from "@mui/material/colors";

const AppLayout = dynamic(() => import("@components/Layouts/AppLayout"), {
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
        </Head>
        {pathName.includes("auth") ||
        pathName.includes("error") ||
        pathName === "/" ? (
          <Component {...pageProps} id={"root"} />
        ) : (
          <Suspense fallback={<Loading isOpen />}>
            <AppLayout>
              <Component {...pageProps} id={"root"} />
            </AppLayout>
          </Suspense>
        )}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
