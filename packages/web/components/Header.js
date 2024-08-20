import Link from 'next/link';

const Header = () => {
    return (
      <header style={styles.header}>
        <div style={styles.logo}>Fluxo Ágil</div>
        <nav style={styles.nav}>
          <Link href="/docs" style={styles.link}>Docs</Link>
          <Link href="/sobre" style={styles.link}>Sobre</Link>
        </nav>
      </header>
    );
  };
  
  const styles = {
    header: {
      backgroundColor: '#88e4dc',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      margin: 0,
      boxSizing: 'border-box', 
    },
    logo: {
      fontWeight: 'bold',
      fontSize: '24px',
    },
    nav: {
      display: 'flex',
      gap: '15px',
    },
    link: {
      textDecoration: 'none',
      color: '#000',
      fontSize: '18px',
    },
  };
  
  export default Header;
  