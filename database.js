// Fake database of users
let users = {
  'joe@smith.com': {
    id: 3,
    email: 'joe@smith.com',
    password: '$2a$10$bGFGwRz.qQybLuFJPptWR.RyDZCIiVRtA2EYvhsNq9vMMrdVUVXLe',
  },
  'joe@bloggs.com': {
    id: 5,
    email: 'joe@bloggs.com',
    password: '$2a$10$Un40mZ9Qs34LAPL56QMv2.NK09yhb3Coq76/jlC6nNGQdLsZW5Zy2',
  },
  'szy0syz@gmail.com': {
    id: 8,
    email: 'szy0syz@gmail.com',
    password: '$2a$10$DOpkKGtmtH4mJe7lL5lr6OFlnbqa4OlVaLyGWYE5iyN7j00cjTUA6',
  }
};

let findUserByEmail = email => users[email];

module.exports = {
  findUserByEmail
};
