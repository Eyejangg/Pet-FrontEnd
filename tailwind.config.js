/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('daisyui'),
    ],
    daisyui: {
        themes: [
            {
                petSmart: {
                    "primary": "#006EF5", // Vibrant Blue
                    "secondary": "#E60000", // Playful Red
                    "accent": "#FFD700", // Gold
                    "neutral": "#3D4451",
                    "base-100": "#FFFFFF",
                },
            },
            "light",
        ],
    },
}
