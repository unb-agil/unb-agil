import '../styles/globals.css';
import { Rubik } from 'next/font/google';
import { CurriculumProvider } from '../contexts/CurriculumContext';

const rubik = Rubik({ subsets: ['latin'] });

function MyApp({ Component, pageProps }) {
  return (
    <CurriculumProvider>
      <div className={rubik.className}>
        <Component {...pageProps} />
      </div>
    </CurriculumProvider>
  );
}

export default MyApp;
