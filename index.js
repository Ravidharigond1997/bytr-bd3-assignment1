const express = require('express');
const { resolve } = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());
app.use(express.json());

let cart = [
  { productId: 1, name: 'Laptop', price: 50000, quantity: 1 },
  { productId: 2, name: 'Mobile', price: 20000, quantity: 2 },
];

function updateExistingCart(cart, productId, productName, price, quantity) {
  let product = {
    productId: productId,
    name: productName,
    price: price,
    quantity: quantity,
  };
  cart.push(product);
  return cart;
}
app.get('/cart/add', (req, res) => {
  let productId = parseInt(req.query.productId);
  let productName = req.query.name;
  let price = parseFloat(req.query.price);
  let quantity = parseInt(req.query.quantity);

  let updatedCart = updateExistingCart(
    cart,
    productId,
    productName,
    price,
    quantity
  );

  res.json({ updatedCart });
});

function updateQuantityOnCart(cart, productId, quantity) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].productId === productId) {
      cart[i].quantity = quantity;
      break;
    }
  }
  return cart;
}
app.get('/cart/edit', (req, res) => {
  let productId = parseInt(req.query.productId);
  let quantity = parseInt(req.query.quantity);

  let updatedCart = updateQuantityOnCart(cart, productId, quantity);

  res.json({ updatedCart });
});

function filterProductOnProductId(product, productId) {
  return product.productId !== productId;
}
app.use('/cart/delete', (req, res) => {
  let productId = parseInt(req.query.productId);

  let filtedCart = cart.filter((product) =>
    filterProductOnProductId(product, productId)
  );

  res.json({ filtedCart });
});

app.get('/cart', (req, res) => {
  res.json({ cartItem: cart });
});

function getTotalQuantityOfCart(cart) {
  let totalCartQuantity = 0;
  for (let i = 0; i < cart.length; i++) {
    totalCartQuantity = cart[i].quantity + totalCartQuantity;
  }

  return totalCartQuantity;
}
app.get('/cart/total-quantity', (req, res) => {
  let totalQuantity = getTotalQuantityOfCart(cart);

  res.json({ totalQuantity });
});

function getTotalPriceOfCart(cart) {
  let totalCartPrice = 0;
  for (let i = 0; i < cart.length; i++) {
    totalCartPrice = cart[i].price + totalCartPrice;
  }

  return totalCartPrice;
}
app.get('/cart/total-price', (req, res) => {
  let totalPrice = getTotalPriceOfCart(cart);

  res.json({ totalPrice });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
