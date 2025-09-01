import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: {
          value: `'Montserrat', sans-serif`,
        },
        body: {
          value: `'Poppins', sans-serif`,
        },
      },
      colors: {
        brand: {
          50: { value: "#e6f0ff" },
          100: { value: "#cce0ff" },
          200: { value: "#99c2ff" },
          300: { value: "#66a3ff" },
          400: { value: "#3385ff" },
          500: { value: "#0066ff" },
          600: { value: "#0052cc" },
          700: { value: "#003d99" },
          800: { value: "#002966" },
          900: { value: "#001433" },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.400}" },
          contrast: { value: "{colors.white}" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.200}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.500}" },
        },
      },
    },
  },
  globalCss: {
    html: {
      scrollBehavior: "smooth",
      overflow: "hidden",
      height: "100%",
    },
    body: {
      overflow: "hidden",
      height: "100%",
      bg: {
        base: "gray.200",
        _dark: "#121214",
      },
      color: {
        base: "gray.700",
        _dark: "white",
      },
    },
  },
});
