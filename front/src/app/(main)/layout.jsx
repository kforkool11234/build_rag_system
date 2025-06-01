import Sidebar from '../../components/sidebar.jsx';
import Header from '../../components/header.jsx';
import '../globals.css';
import Info from "@/components/content";
import { CollectionProvider } from '@/context.jsx';
export default function RootLayout({ children }) {
  return (
      
        <html lang="en">
      <head>
        <title>RAG it up</title>
      </head>
      <body
        style={{ backgroundColor: '#0c151d', color: '#66C3FF' }} // custom colors inline
        className="flex h-screen"
      >
        <CollectionProvider>
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
        </CollectionProvider>
        
      </body>
    </html>
      
      
    
  );
}
