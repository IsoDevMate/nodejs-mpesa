import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import your components
import Checkout from './Home/Home';
import Products from './components/product';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Products</Link>
            </li>
            <li>
              <Link to="/checkout">Checkout</Link>
            </li>
          </ul>
        </nav>

        <Routes>
        <Route exact  path="/" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
