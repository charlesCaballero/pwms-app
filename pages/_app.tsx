import { AppProps } from "next/app";
import Head from "next/head";
import { FC, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { yellow } from "@mui/material/colors";
// import AppLayout from "@components/layouts/app/AppLayout";
import { useRouter } from "next/router";
import "@fontsource/inter/variable-full.css";
import AppLogo from "@assets/images/pwms-logo-2.png";
import dynamic from "next/dynamic";

const AppLayout = dynamic(() => import("@components/layouts/app/AppLayout"), {
  suspense: true,
});

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
          <link rel="shortcut icon" href={AppLogo.src} />
        </Head>
        {pathName.includes("auth") || pathName.includes("error") ? (
          <Component {...pageProps} />
        ) : (
          <Suspense fallback={`Loading...`}>
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          </Suspense>
        )}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
