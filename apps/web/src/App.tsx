import Hero from './screens/publicweb/Hero';
import About from './screens/publicweb/About';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Navbar />
      <Hero />
      <About />
    </div>
  );
}