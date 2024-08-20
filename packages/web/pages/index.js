import Header from '../components/Header';
import Footer from '../components/Footer';
import FileUpload from '../components/FileUpload';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header />
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <FileUpload />
      </main>
      <Footer />
    </div>
  );
}
