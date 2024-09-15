import { Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import AllProductsPage from './pages/Products';

function App() {
  return (
    <Layout>
      <Routes>
        <Route exact path='/' element = {<AllProductsPage/>}/>
      </Routes>
    </Layout>
  );
}

export default App;
