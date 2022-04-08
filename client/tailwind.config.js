module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        app: "var(--font-app)",
      },
      colors: {
        base: "var(--color-base-app)",
        baseLight: "var(--color-base-light-app)",
        text: "var(--color-text)",
        textLight: "var(--color-text-light)",
        canvas: "var(--color-bg-canvas)",
        button: "var(--color-bg-button)",
      },
      screens: {
        desktop: "1680px",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
