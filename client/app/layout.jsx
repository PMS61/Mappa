import '../app/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

// Add this to your CSS file or globals.css
export const metadata = {
  title: 'Mappa',
  description: 'Collaborative coding platform',
};
