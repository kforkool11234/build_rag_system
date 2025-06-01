import '../globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>RAG it up</title>
      </head>
      <body
        style={{ backgroundColor: '#121F2B', color: '#66C3FF' }} // custom colors inline
        className="flex h-screen"
      >
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
      </body>
    </html>
  );
}
