import { Global } from "@mantine/core";

import dyslexic from "./OpenDyslexic-Regular.otf";
import workSans from "./WorkSans-Regular.woff2";

function CustomFonts() {
  return (
    <Global
      styles={[
        {
          "@font-face": {
            fontFamily: "Open-Dyslexic",
            // src: 'url(https://opendyslexic.org/assets/fonts/OpenDyslexic-Regular.otf) format("opentype")',
            src: `url('${dyslexic}') format("opentype")`,
            fontWeight: 400,
            fontStyle: "normal",
            fontDisplay: "swap",
          },
        },

        {
          "@font-face": {
            fontFamily: "Work Sans",
            src: `url(${workSans}) format("woff2")`,
            fontWeight: 400,
            fontStyle: "normal",
            fontDisplay: "swap",
          },
        },
      ]}
    />
  );
}

export default CustomFonts;
