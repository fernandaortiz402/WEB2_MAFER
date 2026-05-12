const Cart = require('../Models/Model_cart');
const Movies = require('../Models/Model_movies');

const populateCart = 'items.movie';
const populateFields = 'Titulo Precio imagenes Cantidad';

const recalculateTotal = (items) => items.reduce((acc, item) => acc + item.price * item.quantity, 0);

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId }).populate(populateCart, populateFields);

    if (!cart) {
      cart = await new Cart({ user: userId, items: [], total: 0 }).save();
      await cart.populate(populateCart, populateFields);
      return res.json(cart);
    }

    const validItems = [];
    for (const item of cart.items) {
      const movie = await Movies.findById(item.movie);
      if (movie && movie.Cantidad >= item.quantity) validItems.push(item);
    }

    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      cart.total = recalculateTotal(validItems);
      cart.updatedAt = new Date();
      await cart.save();
    }

    await cart.populate(populateCart, populateFields);
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Error al obtener el carrito' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { movieId, quantity = 1 } = req.body;
    const userId = req.user._id;

    if (!movieId) return res.status(400).json({ success: false, error: 'ID de pelicula requerido' });
    if (quantity < 1) return res.status(400).json({ success: false, error: 'La cantidad debe ser al menos 1' });

    const movie = await Movies.findById(movieId);
    if (!movie) return res.status(404).json({ success: false, error: 'Pelicula no encontrada' });
    if (movie.Cantidad < quantity) {
      return res.status(400).json({ success: false, error: `Stock insuficiente. Solo quedan ${movie.Cantidad}` });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [], total: 0 });

    const idx = cart.items.findIndex((item) => item.movie.toString() === movieId);
    if (idx > -1) {
      const newQty = cart.items[idx].quantity + quantity;
      if (movie.Cantidad < newQty) return res.status(400).json({ success: false, error: 'Stock insuficiente' });
      cart.items[idx].quantity = newQty;
      cart.items[idx].price = movie.Precio;
    } else {
      cart.items.push({ movie: movieId, quantity, price: movie.Precio });
    }

    cart.total = recalculateTotal(cart.items);
    cart.updatedAt = new Date();
    const saved = await cart.save();
    await saved.populate(populateCart, populateFields);
    return res.status(201).json({ success: true, message: 'Pelicula agregada al carrito', cart: saved });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { movieId, quantity } = req.body;
    const userId = req.user._id;

    if (!movieId || quantity === undefined) {
      return res.status(400).json({ success: false, error: 'ID de pelicula y cantidad requeridos' });
    }
    if (quantity < 1) return res.status(400).json({ success: false, error: 'La cantidad debe ser al menos 1' });

    const movie = await Movies.findById(movieId);
    if (!movie) return res.status(404).json({ success: false, error: 'Pelicula no encontrada' });
    if (movie.Cantidad < quantity) return res.status(400).json({ success: false, error: 'Stock insuficiente' });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, error: 'Carrito no encontrado' });

    const idx = cart.items.findIndex((item) => item.movie.toString() === movieId);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Pelicula no encontrada en el carrito' });

    cart.items[idx].quantity = quantity;
    cart.items[idx].price = movie.Precio;
    cart.total = recalculateTotal(cart.items);
    cart.updatedAt = new Date();

    const updated = await cart.save();
    await updated.populate(populateCart, populateFields);
    return res.json({ success: true, message: 'Carrito actualizado', cart: updated });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user._id;
    if (!movieId) return res.status(400).json({ success: false, error: 'ID de pelicula requerido' });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, error: 'Carrito no encontrado' });

    const initial = cart.items.length;
    cart.items = cart.items.filter((item) => item.movie.toString() !== movieId);
    if (cart.items.length === initial) {
      return res.status(404).json({ success: false, error: 'Pelicula no encontrada en el carrito' });
    }

    cart.total = recalculateTotal(cart.items);
    cart.updatedAt = new Date();
    const updated = await cart.save();
    await updated.populate(populateCart, populateFields);
    return res.json({ success: true, message: 'Pelicula removida del carrito', cart: updated });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    cart.items = [];
    cart.total = 0;
    cart.updatedAt = new Date();
    const cleared = await cart.save();
    return res.json({ success: true, message: 'Carrito vaciado', cart: cleared });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Error al vaciar el carrito' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };