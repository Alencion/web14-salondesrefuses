import '@styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';
import theme from '@styles/theme';
import { RecoilRoot } from 'recoil';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <RecoilRoot>
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </RecoilRoot>
    );
}
export default MyApp;
