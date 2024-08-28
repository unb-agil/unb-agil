import { useContext } from 'react';
import CurriculumContext from '../contexts/CurriculumContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FileUpload from '../components/FileUpload';
import Overview from '../components/Overview';
import SemesterTimeline from '../components/SemesterTimeline';

export default function Home() {
  const { curriculumSigaaId } = useContext(CurriculumContext);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header />
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        {curriculumSigaaId ? <Overview /> : <FileUpload />}
        <SemesterTimeline />
      </main>
      <Footer />
    </div>
  );
}
