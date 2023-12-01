const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const secretKey = process.env.JWT_SECRET || 'default_secret_key';

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(username);

    // Validasi data menggunakan Joi
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate({ username, email, password });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Temukan user berdasarkan email
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verifikasi password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Buat JWT token
    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: '1h',
    });
    console.log(token);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { register, login };
