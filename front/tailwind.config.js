/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",        // app directory (Next.js 13+)
      "./src/pages/**/*.{js,ts,jsx,tsx}",      // pages directory
      "./src/components/**/*.{js,ts,jsx,tsx}", // components directory
    ],
    theme: {
          colors: {
            uteal: "#309898",
            ublack:"#0c151d",
            rblack:"#121F2B", // Double-check spelling and casing here
            ublue:"#66C3FF"
        },
      },
    plugins: [],
  }
  