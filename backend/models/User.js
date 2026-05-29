const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

/**
 * User — esquema de dados do utilizador
 * role - 'regular' por default ou então 'admin'
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
    select: false,
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

// Hash da password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para comparar a password no login
userSchema.methods.comparePassword = function (candidata) {
  return bcrypt.compare(candidata, this.password);
};

module.exports = mongoose.model('User', userSchema);
