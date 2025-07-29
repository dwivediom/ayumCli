// import Document, { Html, Head, Main, NextScript } from "next/document";
// import Script from "next/script";

// class MyDocument extends Document {
//   render() {
//     return (
//       <Html lang="en">
//         <Head>
//           <link rel="manifest" href="/manifest.json" />
//           <link rel="apple-touch-icon" href="/icon.png"></link>
//           <meta name="theme-color" content="#fff" />
//         </Head>
//         <body>
//           <Script
//             src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"
//             strategy="beforeInteractive"
//           />
//           <Script
//             src="https://cdn.tailwindcss.com"
//             strategy="beforeInteractive"
//           />

//           <Script
//             async
//             src="https://www.googletagmanager.com/gtag/js?id=G-NSJGF4EKE6"
//           />
//           <script
//             dangerouslySetInnerHTML={{
//               __html: `
//               window.dataLayer = window.dataLayer || [];
//               function gtag(){dataLayer.push(arguments);}
//               gtag('js', new Date());
//               gtag('config', 'G-NSJGF4EKE6');
//               `,
//             }}
//           />

//           <Main />
//           <NextScript />
//         </body>
//       </Html>
//     );
//   }
// }

// export default MyDocument;

import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png"></link>
          <meta name="theme-color" content="#fff" />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "smcsd6zpij");
              `,
            }}
          />
        </Head>
        <body>
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-NSJGF4EKE6"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NSJGF4EKE6');
              `,
            }}
          />

          <Main />
          <NextScript />
          <Script src="https://unpkg.com/flowbite@1.5.1/dist/flowbite.js" />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
