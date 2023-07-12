module.exports = {
  content: ["./src/**/*.{js}"],
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
        card1: "var(--color-bg-card-1)",
        card2: "var(--color-bg-card-2)",
        card3: "var(--color-bg-card-3)",
        card4: "var(--color-bg-card-4)",
        card5: "var(--color-bg-card-5)",
        card6: "var(--color-bg-card-6)",
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
