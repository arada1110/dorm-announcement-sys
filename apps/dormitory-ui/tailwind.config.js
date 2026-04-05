/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts}"],
    theme: {
        extend: {
            fontFamily: {
                prompt: ["Prompt", "sans-serif"],
            },

            fontSize: {
                xs: ["12px", "1.4"],
                "2xs": ["13px", "1.5"],
                sm: ["14px", "1.5"],
                base: ["16px", "1.7"],
                lg: ["18px", "1.7"],
                xl: ["20px", "1.6"],
                "2xl": ["24px", "1.5"],
                "3xl": ["30px", "1.4"],
                "4xl": ["36px", "1.3"],
                "5xl": ["44px", "1.2"],
            },

            extend: {
                fontWeight: {
                    normal: "400",
                    medium: "500",
                    semibold: "600",
                    bold: "700",
                },
            },
        },
    },
    plugins: [require("@tailwindcss/line-clamp")],
};
