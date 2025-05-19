import ButtonGradient from "./assets/svg/ButtonGradient";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Benefits from "./components/Benefits";


const App = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Routes>
          <Route path="/" element={<><Benefits /><Footer /></>} />
          
        </Routes>
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
