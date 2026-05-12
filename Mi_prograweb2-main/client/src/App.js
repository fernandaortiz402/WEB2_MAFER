import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { MovieProvider } from './context/MovieContext';
import Header from './components/common/Header';
import PageTransitionLayout from './components/layout/PageTransitionLayout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import NuevoProducto from './pages/NuevoProducto';
import ReporteVentas from './pages/ReporteVentas';
import ProductoPage from './pages/ProductoPage';
import DetalleCompra from './pages/DetalleCompra';
import MisCompras from './pages/MisCompras';
import PrivateRoute from './components/common/PrivateRoute';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MovieProvider>
          <CartProvider>
            <div className="App">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route element={<PageTransitionLayout />}>
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/producto/:id" element={<ProductoPage />} />
                  </Route>
                  <Route
                    path="/detalle-compra/:id"
                    element={
                      <PrivateRoute roles={['Cliente', 'Comprador', 'cliente', 'comprador']}>
                        <DetalleCompra />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/mis-compras"
                    element={
                      <PrivateRoute roles={['Cliente', 'Comprador', 'cliente', 'comprador']}>
                        <MisCompras />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/nuevo-producto" element={<NuevoProducto />} />
                  <Route
                    path="/reporte-ventas"
                    element={
                      <PrivateRoute roles={['vendedor', 'Vendedor']}>
                        <ReporteVentas />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/auth" element={<AuthPage />} />
                </Routes>
              </main>
            </div>
          </CartProvider>
        </MovieProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
