module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        app: "var(--font-app)",
      },
      colors: {
        base: "var(--color-base-app)",
        text: "var(--color-text)",
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
