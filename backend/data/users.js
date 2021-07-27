import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('adminuser', 10),
    isAdmin: true
  },
  {
    name: 'Jack Black',
    email: 'jblack@example.com',
    password: bcrypt.hashSync('jblack', 10),
    isAdmin: false
  },
  {
    name: 'Hugo Viana',
    email: 'hviana@example.com',
    password: bcrypt.hashSync('hviana', 10),
    isAdmin: false
  }
];

export default users;
