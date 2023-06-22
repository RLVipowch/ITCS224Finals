const express = require('express');
const app = express();
const port = 4000;

app.use(express.json());

let users = [
{
email: "robertolatorilla",
password: "admin",
isAdmin: true
},
{
email: "notadmin",
password: "notadmin",
isAdmin: false
},
{
email: "test",
password: "test",
isAdmin: false
}
];

let products = [
{
id: "1",
name: "Phone",
description: "ROG Phone 6",
price: 70000,
isActive: false,
createdOn: Date.now()
},
{
id: "2",
name: "Computer",
description: "High End CPU Bundle",
price: 120000,
isActive: true,
createdOn: Date.now()
},
{
id: "3",
name: "Television",
description: "Average Samsung TV",
price: 50000,
isActive: true,
createdOn: Date.now()
}
];

let orders = [
{
userId: "notadmin",
products: [
{
name: "Television",
price: 50000,
amount: 1
}
],
totalAmount: 50000,
purchasedOn: Date.now()
},
{
userId: "test",
products: [
{
name: "Computer",
price: 120000,
amount: 8
}
],
totalAmount: 960000,
purchasedOn: Date.now()
}
];

let loggedUser = users[0];

app.listen(4000, () => {
console.log('Server is running on port 4000');
});

app.post('/users/signup', (req, res) => {
    console.log(req.body);
    let newUser = {
      email: req.body.email,
      password: req.body.password,
      isAdmin: false
    };
    users.push(newUser);
    console.log(users);
    res.send('Registered Successfully');
  });
  
  app.post('/users/login', (req, res) => {
    console.log(req.body);
    let foundUser = users.find((user) => {
      return user.email === req.body.email && user.password === req.body.password;
    });
    if (foundUser !== undefined) {
      let foundUserIndex = users.findIndex((user) => {
        return user.email === foundUser.email;
      });
      foundUser.index = foundUserIndex;
      loggedUser = foundUser;
      console.log(loggedUser);
      res.send('Login Successful.');
    } else {
      loggedUser = foundUser;
      res.send('Login failed, wrong credentials.');
    }
  });
// Create a product (for Admin only)
app.post('/products', (req, res) => {
if (loggedUser.isAdmin) {
const newProduct = {
id: (products.length + 1).toString(),
name: req.body.name,
description: req.body.description,
price: req.body.price,
isActive: true,
createdOn: Date.now()
};
products.push(newProduct);
res.send('Product created successfully');
} else {
res.status(401).send('Unauthorized to Create Product');
}
});

// Get all active products
app.get('/products', (req, res) => {
const activeProducts = products.filter(product => product.isActive);
res.json(activeProducts);
});

// Get a product by productId
app.get('/products/:productId', (req, res) => {
const productId = req.params.productId;
const product = products.find(product => product.id === productId);

if (product) {
res.json(product);
} else {
res.status(404).send('Product not found');
}
});

// Get all orders (admin only)
app.get('/users/orders', (req, res) => {
if (loggedUser.isAdmin) {
res.json(orders);
} else {
res.status(401).send('Unauthorized to Get All Orders');
}
});

// Get orders for a specific user
app.get('/users/orders', (req, res) => {
const userOrders = orders.filter(order => order.userId === loggedUser.email);
res.json(userOrders);
});





