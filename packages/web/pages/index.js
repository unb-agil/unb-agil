import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header />
      <main style={{ paddingBottom: '50px' }}>
        {/* Conteúdo principal da página */}
      </main>
      <Footer />
    </div>
  );
}
