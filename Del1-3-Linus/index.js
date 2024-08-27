// // q: import express and create endpoints witch get, post, update, delete

// // import express
// const express = require('express');
// // create express app
// // import prismaClient
// const { PrismaClient } = require('@prisma/client');
// const app = express();
// // set port, listen for requests

// const prisma = new PrismaClient();

// // use the express.json() middleware to parse JSON requests body
// app.use(express.json());
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

// // create a GET endpoint
// // app.get('/', async (req, res) => {
// //     const users = await prisma.user.findMany();
// //     console.log("users", users);
// //   res.send('GET request to the homepage');
// // });

// app.get('/', async (req, res) => {
//     try {
//       // Fetch all users from the database
//       const users = await prisma.user.findMany();

//       // Log the users to the console (optional)
//       console.log('users', users);

//       // Send the users as a JSON response
//       res.status(200).json(users);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       res.status(500).json({ error: 'An error occurred while fetching users' });
//     } finally {
//       await prisma.$disconnect();
//     }
//   });

// // create a POST endpoint
// app.post('/', (req, res) => {
//   // create a user wih prisma
//   const prisma = new PrismaClient();
//   const createUser = async (req) => {
//     const { email, name, age } = req.body;
//     const user = await prisma.user.create({
//       data: {
//         username: req.body.username,
//         email: req.body.email,
//         name: req.body.name,
//         password: req.body.password,
//         nickname: req.body.nickname,
//       },
//     });
//     return user;
//   };
//   createUser(req);
//   console.log('req.body', req.body);

//   res.send({ message: 'POST request to the homepage' });
// });

// const validateUser = [
//     body("username")
//       .isString()
//       .withMessage("Username must be a string")
//       .isLength({ min: 3 })
//       .withMessage("Username must be at least 3 characters long"),
//     body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
//     body("password")
//       .isString()
//       .withMessage("Password must be a string")
//       .isLength({ min: 6 })
//       .withMessage("Password must be at least 6 characters long"),
//   ];

// // create a PUT endpoint
// app.put('/', (req, res) => {
//   res.send('PUT request to the homepage');
// });

// // create a DELETE endpoint
// app.delete('/', (req, res) => {
//   res.send('DELETE request to the homepage');
// });

const { PrismaClient } = require('@prisma/client');
const express = require('express');
const { body, validationResult } = require('express-validator');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const validateUser = [
  body('username')
    .isString()
    .withMessage('Username must be a string')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.get('/users/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.send({ error: 'Invalid id, must be a number.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    return res.send({ message: 'User found', user });
  } catch (error) {
    console.error(error);
    return res.send({ error: error.message });
  }
});

app.post('/users', validateUser, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newUser = await prisma.user.create({
    data: {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    },
  });
  return res.send({ message: 'Created user', user: newUser });
});

// app.put('/users', validateUser, async (req, res) => {
app.put('/users', async (req, res) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    const updatedUser = await prisma.user.update({
      where: { id: req.body.id },
      data: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      },
    });
    return res.send({ message: 'Updated user', user: updatedUser });
  }
  return res.send({ errors: result.array() });
});


app.delete('/users/:id')