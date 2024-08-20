import Link from 'next/link';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <Link href="/licenca" style={styles.link}>Licença</Link>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#88e4dc',
    padding: '10px 0',
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  link: {
    textDecoration: 'none',
    color: '#000',
    fontSize: '18px',
  },
};

export default Footer;
