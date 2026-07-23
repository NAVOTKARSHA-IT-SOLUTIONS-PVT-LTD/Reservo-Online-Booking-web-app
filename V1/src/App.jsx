import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Hero from "./components/Hero";
import PopularDestinations from "./components/PopularDestinations";
import FeaturedResorts from "./components/FeaturedResorts";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Newsletter from "./components/Newsletter";

import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function Home() {
  return (
    <>
      <Hero />
      <PopularDestinations />
      <FeaturedResorts />
      <Services />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </>
  );
}

function App() {
  return (
    <div className="app">

      <Header />

      <main>

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </main>

      <Footer />

    </div>
  );
}

export default App;