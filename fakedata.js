const faker = require('faker');
const axios = require('axios');

const PRODUCTS_API = 'http://localhost:3000';
const randomInt = () => Math.floor(Math.random() * 10);

const registerUser = async () => {
  const { data: register } = await axios.post(
    `${PRODUCTS_API}/user`,
    {
      username: faker.internet.userName(),
      password: 'password',
    }
  );

  const { data: login } = await axios.post(
    `${PRODUCTS_API}/user/login`,
    {
      username: register.username,
      password: 'password',
    }
  );
  
  console.log(login);
  return login.token;
};

const addProduct = async (token) => {
  const {data: product} = await axios.post(
    `${PRODUCTS_API}/product`,
    {
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      price: faker.commerce.price(),
      imageURL: faker.image.imageUrl(),
    }, 
    {
      headers:
      {
        authorization: `Bearer ${token}`
      }
    }
  );

  console.log(product);
  return product;
};

(async () => {
  const totalUsers = randomInt();
  for (let i = 0; i < totalUsers; i++) {
    const token = await registerUser();
    const totalProds = randomInt();
    for (let j = 0; j < totalProds; j++) {
      addProduct(token);
    }
  }
})();
