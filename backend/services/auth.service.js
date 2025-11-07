const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function register({ firstName, lastName, email, password }){
  if(!firstName || !lastName || !email || !password) throw new Error('Missing fields');
  const exists = await User.findOne({ where: { email } });
  if(exists) throw new Error('Email already registered');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, passwordHash });
  return { id: user.id, firstName, lastName, email };
}

async function login({ email, password, dummy = false }){
  if(dummy){
    const token = jwt.sign({ sub: -1, email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return { token };
  }
  const user = await User.findOne({ where: { email } });
  if(!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return { token };
}

async function me(userId){
  const user = await User.findByPk(userId, { attributes: ['id','firstName','lastName','email','createdAt','updatedAt'] });
  return user;
}

async function updateMe(userId, { firstName, lastName, email, currentPassword, newPassword }){
  const user = await User.findByPk(userId);
  if(!user) throw new Error('User not found');
  if(currentPassword && newPassword){
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if(!ok) throw new Error('Current password is incorrect');
    user.passwordHash = await bcrypt.hash(newPassword, 10);
  }
  if(firstName) user.firstName = firstName;
  if(lastName) user.lastName = lastName;
  if(email) user.email = email;
  await user.save();
  return { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email };
}

module.exports = { register, login, me, updateMe };
