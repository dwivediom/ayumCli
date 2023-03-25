import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png"></link>
          <meta name="theme-color" content="#fff" />
        </Head>
        <body className="bg-gray-800  ">
          <Script
            src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"
            strategy="beforeInteractive"
          />
          <Script
            src="https://cdn.tailwindcss.com"
            strategy="beforeInteractive"
          />

          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-1RJPF2S40R"
          />
          <Script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1RJPF2S40R');
              `,
            }}
          />

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
