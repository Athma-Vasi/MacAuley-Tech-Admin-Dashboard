import { Global } from '@mantine/core';

import regular from '../../fonts/OpenDyslexic-Regular.otf';

function CustomFonts() {
  return (
    <Global
      styles={[
        {
          '@font-face': {
            fontFamily: 'Open-Dyslexic',
            // src: 'url(https://opendyslexic.org/assets/fonts/OpenDyslexic-Regular.otf) format("opentype")',
            src: `url('${regular}') format("opentype")`,
            fontWeight: 400,
            fontStyle: 'normal',
            fontDisplay: 'swap',
          },
        },
      ]}
    />
  );
}

export default CustomFonts;
