/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'custom': '0 4px 20px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-blue-50',
    'bg-green-50',
    'bg-purple-50',
    'bg-indigo-50',
    'bg-blue-100',
    'bg-green-100',
    'bg-purple-100',
    'bg-indigo-100',
    'text-blue-500',
    'text-green-500',
    'text-purple-500',
    'text-indigo-500',
    'text-blue-600',
    'text-green-600',
    'text-purple-600',
    'text-indigo-600',
  ],
};