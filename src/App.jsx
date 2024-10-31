import LandingPage from './Pages/LandingPage/LandingPage';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import AdminPage from './Pages/Dashboard/AdminPage';
import NavbarDashboard from './Components/Navdash/NavbarDashboard';
import HeroCarousel from './Components/HeroCarousel';
import Banner from './Pages/Banner/Banner';
import Promo from './Pages/Promo/Promo';
import Category from './Pages/Category/Category';
import Activity from './Pages/Activity/Activity';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/admin-page' element={<AdminPage />} />
        <Route path='/navbar-dashboard' element={<NavbarDashboard />} />
        <Route path='/hero-caraousel' element={<HeroCarousel />} />
        <Route path='/banner' element={<Banner />} />
        <Route path='/promo' element={<Promo />} />
        <Route path='/category' element={<Category />} />
        <Route path='/activity' element={<Activity />} />
      </Routes>
    </Router>
  );
};

export default App;
