// pages/CartPage.js - VERSIÓN CORREGIDA
import React, { useState } from 'react'; // ✅ Agregar useState
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartItemsCount, cartTotal, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  if (!isAuthenticated) {
    return (
      <section className="section container">
        <div className="section__head">
          <h2>🍿 Tu Pedido</h2>
          <p>Gestiona tu selección antes de finalizar la compra</p>
        </div>
        <div className="cart">
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent)' }}>
            <p>Debes iniciar sesión para ver tu carrito</p>
            <button 
              className="btn btn--primary"
              onClick={() => navigate('/auth')}
              style={{ marginTop: '1rem' }}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="section container">
        <div className="section__head">
          <h2>🍿 Tu Pedido</h2>
          <p>Gestiona tu selección antes de finalizar la compra</p>
        </div>
        <div className="cart">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando carrito...</p>
          </div>
        </div>
      </section>
    );
  }

  // ✅ VERIFICAR SI CART EXISTE Y TIENE ITEMS
  const hasItems = cart && cart.items && cart.items.length > 0;

  const handleConfirmPayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    try {
      console.log('💳 Confirmando pago con:', selectedPaymentMethod);
      
      const result = await orderService.createOrder(selectedPaymentMethod);
      
      if (result.success) {
        alert(`✅ ¡Orden creada exitosamente! Total: $${result.order.total} MXN`);
        setShowPaymentModal(false);
        setSelectedPaymentMethod(null);
        clearCart(); // ✅ Usar clearCart en lugar de refreshCart
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error en el pago:', error);
      alert(`❌ Error al procesar el pago: ${error.message}`);
    }
  };

  // Función para manejar la actualización de cantidad
  const handleUpdateQuantity = async (movieId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(movieId);
    } else {
      await updateQuantity(movieId, newQuantity);
    }
  };

  // Función para obtener la URL de la imagen
  const getImageUrl = (movie) => {
    if (movie.imagenes && movie.imagenes.length > 0 && movie.imagenes[0].filename) {
      return `http://localhost:3000/uploads/${movie.imagenes[0].filename}`;
    }
    return 'https://via.placeholder.com/100x100/4A5568/FFFFFF?text=Imagen';
  };

  // Función para abrir el modal de pago
  const handleProceedToPayment = () => {
    setShowPaymentModal(true);
    setSelectedPaymentMethod(null); // Resetear selección al abrir
  };

  return (
    <section className="section container">
      <div className="section__head">
        <h2>🍿 Tu Pedido</h2>
        <p>Gestiona tu selección antes de finalizar la compra</p>
      </div>
      
      <div className="cart">
        {/* ✅ VERIFICACIÓN SEGURA */}
        {!hasItems ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent)' }}>
            <p>Tu carrito está vacío</p>
            <button 
              className="btn btn--primary"
              onClick={() => navigate('/catalog')}
              style={{ marginTop: '1rem' }}
            >
              Ir al Catálogo
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>🍿 Tu Pedido ({cartItemsCount} artículo{cartItemsCount !== 1 ? 's' : ''})</h3>
              <button 
                className="btn btn--ghost btn--small"
                onClick={clearCart}
                style={{ color: '#ff4757' }}
              >
                🗑️ Vaciar Carrito
              </button>
            </div>

            <div id="cartItems">
              {/* ✅ VERIFICACIÓN SEGURA DE cart.items */}
              {cart.items.map((item) => (
                <div key={item._id || item.movie._id} className="cart-item">
                  <img 
                    src={getImageUrl(item.movie)} 
                    alt={item.movie.Titulo}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  
                  <div className="cart-item__info">
                    <h4 className="cart-item__title">{item.movie.Titulo}</h4>
                    <p className="cart-item__platform">
                      {item.movie.plataforma?.Nombre_Plataforma || 'Plataforma no especificada'}
                    </p>
                    <div className="cart-item__price">${item.price} MXN c/u</div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="cantidad-controls">
                      <button 
                        className="cantidad-btn"
                        onClick={() => handleUpdateQuantity(item.movie._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span style={{ margin: '0 10px', minWidth: '30px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button 
                        className="cantidad-btn"
                        onClick={() => handleUpdateQuantity(item.movie._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div style={{ fontWeight: '600', minWidth: '80px', textAlign: 'center' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button 
                      className="btn btn--ghost btn--small"
                      onClick={() => removeFromCart(item.movie._id)}
                      style={{ color: '#ff4757' }}
                      title="Eliminar del carrito"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-total">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal ({cartItemsCount} artículos):</span>
                <strong>${cartTotal.toFixed(2)} MXN</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--accent)' }}>
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', fontSize: '1.1rem', fontWeight: '600' }}>
                <span>Total:</span>
                <strong>${cartTotal.toFixed(2)} MXN</strong>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button 
                  className="btn btn--ghost"
                  onClick={() => navigate('/catalog')}
                >
                  ← Seguir Comprando
                </button>
                <button 
                  className="btn btn--primary btn--large"
                  onClick={handleProceedToPayment} // ✅ Usar la nueva función
                >
                  💳 Proceder al Pago
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de pago */}
      {showPaymentModal && (
        <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal__header">
              <h3>💳 Selecciona método de pago</h3>
              <button 
                className="payment-modal__close"
                onClick={() => setShowPaymentModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="payment-modal__body">
              <p className="payment-modal__total">Total a pagar: <strong>${cartTotal.toFixed(2)} MXN</strong></p> {/* ✅ Usar cartTotal */}
              
              <div className="payment-methods">
                <div 
                  className={`payment-method ${selectedPaymentMethod === 'tarjeta' ? 'selected' : ''}`}
                  onClick={() => setSelectedPaymentMethod('tarjeta')}
                >
                  <div className="payment-method__icon">💳</div>
                  <div className="payment-method__info">
                    <h4>Tarjeta de crédito/débito</h4>
                    <p>Pago seguro con tarjeta</p>
                  </div>
                  {selectedPaymentMethod === 'tarjeta' && (
                    <div className="payment-method__check">✓</div>
                  )}
                </div>

                <div 
                  className={`payment-method ${selectedPaymentMethod === 'transferencia' ? 'selected' : ''}`}
                  onClick={() => setSelectedPaymentMethod('transferencia')}
                >
                  <div className="payment-method__icon">🏦</div>
                  <div className="payment-method__info">
                    <h4>Transferencia bancaria</h4>
                    <p>Transferencia directa a cuenta bancaria</p>
                  </div>
                  {selectedPaymentMethod === 'transferencia' && (
                    <div className="payment-method__check">✓</div>
                  )}
                </div>
              </div>

              {selectedPaymentMethod && (
                <div className="payment-method__details">
                  {selectedPaymentMethod === 'tarjeta' ? (
                    <div className="payment-form">
                      <div className="form-group">
                        <label>Número de tarjeta</label>
                        <input 
                          type="text" 
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Fecha de vencimiento</label>
                          <input 
                            type="text" 
                            placeholder="MM/AA"
                            maxLength="5"
                          />
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input 
                            type="text" 
                            placeholder="123"
                            maxLength="4"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Nombre del titular</label>
                        <input 
                          type="text" 
                          placeholder="Nombre completo"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="transfer-info">
                      <h4>Datos para transferencia:</h4>
                      <div className="transfer-details">
                        <p><strong>Banco:</strong> Banco Ejemplo</p>
                        <p><strong>CLABE:</strong> 012345678901234567</p>
                        <p><strong>Cuenta:</strong> 1234-5678-9012-3456</p>
                        <p><strong>Beneficiario:</strong> Movie Box S.A. de C.V.</p>
                        <p className="transfer-note">
                          ⚠️ Envía el comprobante de transferencia a: compras@moviebox.com
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="payment-modal__actions">
                <button 
                  className="btn btn--ghost"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn btn--primary"
                  onClick={handleConfirmPayment} // ✅ Usar la función corregida
                  disabled={!selectedPaymentMethod}
                >
                  Confirmar pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CartPage;