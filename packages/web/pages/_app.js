import '../styles/globals.css';
import { Rubik } from 'next/font/google';

const rubik = Rubik({ subsets: ['latin'] });

function MyApp({ Component, pageProps }) {
  return (
    <div className={rubik.className}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
