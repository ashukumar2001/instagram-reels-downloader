import Head from "next/head";
import "../styles/globals.css";
import "../styles/Loader.css";
import { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Instagram Reels Downloader" />
        <meta name="keywords" content="instagram, reels, downloader" />
        <title>Instagram Reel Downloader</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/icon_x48.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/icon_x48.png"
          rel="icon"
          type="image/png"
          sizes="48x48"
        />
        <link rel="apple-touch-icon" href="/favicon.png"></link>
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
