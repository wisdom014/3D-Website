import './App.css';
import Hero from './components/Hero';
import NavBar from './components/NavBar';
import About from './components/About';
import Playground from './components/Playground';
import Contact from './components/Contact';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Hero />
      <About />
      <Playground />
      <Contact />
    </div>
  );
}

export default App;
