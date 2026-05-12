// context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, currentUser } = useAuth();

  // Cargar carrito cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, currentUser]);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart();
      setCart(response);
    } catch (err) {
      console.error('Error loading cart:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (movieId, quantity = 1) => {
    try {
      if (!isAuthenticated) {
        throw new Error('Debes iniciar sesión para agregar al carrito');
      }

      console.log('🛒 Agregando al carrito:', { movieId, quantity });
      const response = await cartService.addToCart(movieId, quantity);
      
      if (response.success) {
        setCart(response.cart);
        return { success: true, message: response.message };
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      return { success: false, error: err.message };
    }
  };

  const updateQuantity = async (movieId, quantity) => {
    try {
      console.log('🛒 Actualizando cantidad:', { movieId, quantity });
      const response = await cartService.updateQuantity(movieId, quantity);
      
      if (response.success) {
        setCart(response.cart);
        return { success: true, message: response.message };
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      return { success: false, error: err.message };
    }
  };

  const removeFromCart = async (movieId) => {
    try {
      console.log('🛒 Eliminando del carrito:', movieId);
      const response = await cartService.removeFromCart(movieId);
      
      if (response.success) {
        setCart(response.cart);
        return { success: true, message: response.message };
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
      return { success: false, error: err.message };
    }
  };

  const clearCart = async () => {
    try {
      console.log('🛒 Vaciando carrito');
      const response = await cartService.clearCart();
      
      if (response.success) {
        setCart(response.cart);
        return { success: true, message: response.message };
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      return { success: false, error: err.message };
    }
  };

  // Calcular estadísticas del carrito
  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const cartTotal = cart?.total || 0;

  const value = {
    // Estado
    cart,
    loading,
    error,
    
    // Acciones
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: loadCart,
    
    // Calculados
    cartItemsCount,
    cartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};