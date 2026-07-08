import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BotaoTopo from './BotaoTopo';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-forest-dark text-ink dark:text-cream transition-colors">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
      <Footer />
      <BotaoTopo />
    </div>
  );
}
