import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import your components
import Checkout from './Home/Home';
import Products from './components/product';
import TransactionHistory from './components/transactions';
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
            <li>
              <Link to="/transactions">Transactions</Link>
            </li>
          </ul>
        </nav>
        <Routes>
        <Route exact  path="/" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path='/transactions' element={<TransactionHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
