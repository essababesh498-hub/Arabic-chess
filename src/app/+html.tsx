import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';
import { brand } from '../lib/brand';

/** Web document shell — RTL so the desktop simulator matches Arabic layout. */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>{brand.name}</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: ROOT_CSS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const ROOT_CSS = `
html, body, #root {
  height: 100%;
  margin: 0;
  background: #090A0D;
}
body {
  overflow: hidden;
}
`;
