// Controllers/orderController.js
const Order = require('../Models/Model_orders');
const Cart = require('../Models/Model_cart');
const Movies = require('../Models/Model_movies');
const Rating = require('../Models/Model_rating');
const Comments = require('../Models/Model_comments');
const User = require('../Models/Model_user');

const norm = (r) => (r || '').toString().trim().toLowerCase();

// Crear orden desde el carrito
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { metodoPago } = req.body;

    console.log('🛒 Creando orden para usuario:', userId);
    console.log('💳 Método de pago:', metodoPago);

    const cart = await Cart.findOne({ user: userId })
      .populate('items.movie', 'Titulo Distribuidor Cantidad Precio');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El carrito está vacío'
      });
    }

    const orderItems = [];
    
    for (const cartItem of cart.items) {
      const movie = cartItem.movie;
      
      if (movie.Cantidad < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          error: `Stock insuficiente para ${movie.Titulo}. Disponible: ${movie.Cantidad}`
        });
      }

      orderItems.push({
        movie: movie._id,
        titulo: movie.Titulo,
        distribuidor: movie.Distribuidor,
        cantidad: cartItem.quantity,
        precio: cartItem.price,
        subtotal: cartItem.price * cartItem.quantity
      });
    }

    // 3. Crear la orden
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      total: cart.total,
      metodoPago: metodoPago
    });

    const savedOrder = await newOrder.save();
    console.log('✅ Orden creada:', savedOrder._id);

    for (const cartItem of cart.items) {
      await Movies.findByIdAndUpdate(
        cartItem.movie._id,
        { $inc: { Cantidad: -cartItem.quantity } }
      );
    }

    // 5. Vaciar carrito
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], total: 0 }
    );

    // 6. Responder con la orden creada
    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      order: savedOrder
    });

  } catch (error) {
    console.error('❌ Error creando orden:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear la orden'
    });
  }
};

// Obtener órdenes del usuario
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const orders = await Order.find({ user: userId })
      .populate('items.movie', 'Titulo Genero imagenes')
      .sort({ fecha: -1 });

    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('❌ Error obteniendo órdenes:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las órdenes'
    });
  }
};

// Obtener ventas del vendedor
const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;
    
    // Buscar órdenes que tengan items de este vendedor
    const orders = await Order.find({ 
      'items.distribuidor': vendorId 
    })
    .populate('user', 'Nombre_usuario Correo')
    .populate('items.movie', 'Titulo imagenes')
    .sort({ fecha: -1 });

    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('❌ Error obteniendo ventas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las ventas'
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const buyerRoles = ['comprador', 'cliente'];
    if (!buyerRoles.includes(norm(req.user.Rol))) {
      return res.status(403).json({ success: false, error: 'Solo compradores pueden ver el detalle de compra' });
    }

    const order = await Order.findById(req.params.id)
      .populate({
        path: 'items.movie',
        select: 'Titulo Genero imagenes Precio Estudio',
        populate: { path: 'Estudio', select: 'Nombre_Estudio' }
      })
      .populate('items.distribuidor', 'Nombre_usuario');

    if (!order) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }

    if (String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, error: 'No tienes permiso para ver esta orden' });
    }

    return res.json({ success: true, order });
  } catch (error) {
    console.error('❌ Error getOrderById:', error);
    return res.status(500).json({ success: false, error: 'Error al obtener la orden' });
  }
};

const getReporteVentas = async (req, res) => {
  try {
    if (norm(req.user.Rol) !== 'vendedor') {
      return res.status(403).json({ success: false, error: 'Solo vendedores pueden ver el reporte de ventas' });
    }

    const vendorId = req.user._id;
    const { fechaInicio, fechaFin } = req.query;

    const filter = { 'items.distribuidor': vendorId };
    if (fechaInicio || fechaFin) {
      filter.fecha = {};
      if (fechaInicio) filter.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) {
        const end = new Date(fechaFin);
        end.setHours(23, 59, 59, 999);
        filter.fecha.$lte = end;
      }
    }

    const orders = await Order.find(filter)
      .populate({
        path: 'items.movie',
        select: 'Titulo Genero Estudio',
        populate: { path: 'Estudio', select: 'Nombre_Estudio' }
      })
      .populate('items.distribuidor', 'Nombre_usuario')
      .sort({ fecha: -1 });

    const lineas = [];
    let totalVentas = 0;
    let totalUnidades = 0;
    const ordenesIds = new Set();

    for (const order of orders) {
      for (const it of order.items) {
        if (String(it.distribuidor?._id || it.distribuidor) !== String(vendorId)) continue;
        const studio = it.movie?.Estudio?.Nombre_Estudio;
        const dist = it.distribuidor?.Nombre_usuario;
        const distribuidorEstudio = [dist, studio].filter(Boolean).join(' / ') || '-';
        lineas.push({
          ordenId: order._id,
          fecha: order.fecha,
          titulo: it.movie?.Titulo || it.titulo,
          distribuidorEstudio,
          cantidad: it.cantidad,
          precioUnitario: it.precio,
          total: it.subtotal
        });
        totalVentas += it.subtotal;
        totalUnidades += it.cantidad;
        ordenesIds.add(String(order._id));
      }
    }

    const numTransacciones = ordenesIds.size || 0;
    const promedioPorVenta = numTransacciones ? totalVentas / numTransacciones : 0;

    return res.json({
      success: true,
      lineas,
      resumen: {
        totalVentas,
        totalUnidades,
        promedioPorVenta,
        numTransacciones
      }
    });
  } catch (error) {
    console.error('❌ Error reporte ventas:', error);
    return res.status(500).json({ success: false, error: 'Error al generar el reporte' });
  }
};

const submitOrderReview = async (req, res) => {
  try {
    const buyerRoles = ['comprador', 'cliente'];
    if (!buyerRoles.includes(norm(req.user.Rol))) {
      return res.status(403).json({ success: false, error: 'Solo compradores pueden calificar' });
    }

    const { orderId } = req.params;
    const { movieId, Calificacion, Comentario } = req.body;

    if (!movieId || Calificacion == null) {
      return res.status(400).json({ success: false, error: 'movieId y Calificacion son requeridos' });
    }

    const cal = Number(Calificacion);
    if (Number.isNaN(cal) || cal < 1 || cal > 5) {
      return res.status(400).json({ success: false, error: 'La calificacion debe ser entre 1 y 5' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    if (String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, error: 'No puedes calificar esta orden' });
    }

    const item = order.items.find((i) => String(i.movie) === String(movieId));
    if (!item) {
      return res.status(400).json({ success: false, error: 'La pelicula no pertenece a esta orden' });
    }

    let ratingDoc = await Rating.findOne({ movie: movieId, user: req.user._id });
    if (ratingDoc) {
      ratingDoc.Calificacion = cal;
      await ratingDoc.save();
    } else {
      ratingDoc = await Rating.create({
        Calificacion: cal,
        movie: movieId,
        user: req.user._id
      });
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { Rating: ratingDoc._id } });
    }

    if (Comentario && String(Comentario).trim()) {
      const com = await Comments.create({
        Comentario: String(Comentario).trim(),
        movie: movieId,
        user: req.user._id
      });
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { Comment: com._id } });
    }

    return res.status(201).json({
      success: true,
      message: 'Gracias por tu calificacion',
      rating: ratingDoc
    });
  } catch (error) {
    console.error('❌ Error submitOrderReview:', error);
    return res.status(500).json({ success: false, error: 'Error al guardar la reseña' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getVendorOrders,
  getOrderById,
  getReporteVentas,
  submitOrderReview
};