const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

/**
 * User — esquema de utilizador
 * Campos: nome, email, telemovel, password (hash), role, bio
 * role: 'regular' (default) | 'admin'
 */
const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'O email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  telemovel: {
    type: String,
    default: '',
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'A palavra-passe é obrigatória'],
    minlength: [6, 'Mínimo 6 caracteres'],
    select: false, // nunca devolvida nas queries
  },
  role: {
    type: String,
    enum: ['regular', 'admin'],
    default: 'regular',
  },
  bio: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Hash da password antes de guardar (só se foi alterada)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para comparar password no login
userSchema.methods.comparePassword = function (candidata) {
  return bcrypt.compare(candidata, this.password);
};

module.exports = mongoose.model('User', userSchema);
