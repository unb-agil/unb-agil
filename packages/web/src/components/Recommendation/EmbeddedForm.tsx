import { useEffect } from 'react';
import { Box } from '@mui/material';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    formsappid?: string;
  }
}

export default function EmbeddedForm() {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://forms.app/static/embed.js';
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // @ts-expect-error - formsapp embed script
      new formsapp(
        '679a5759f155c700021a274c',
        'standard',
        { width: '100vw', height: '600px', opacity: 0 },
        'https://qt14lqf2.forms.app',
      );
    };

    document.body.appendChild(script);
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      border={1}
      borderRadius={1}
      borderColor="primary.main"
      p={0.5}
    >
      <div formsappid="679a5759f155c700021a274c" />

      <iframe
        id=""
        allow="geolocation; microphone; camera"
        src="https://qt14lqf2.forms.app/form/679a5759f155c700021a274c"
        style={{
          width: '100vw',
          minWidth: '100%',
          height: '600px',
          border: 'none',
        }}
      />
    </Box>
  );
}
