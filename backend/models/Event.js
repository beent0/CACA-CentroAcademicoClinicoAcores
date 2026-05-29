const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'O título é obrigatório'],
    trim: true
  },
  descricao: {
    type: String,
    required: [true, 'A descrição é obrigatória']
  },
  data: {
    type: String,
    required: [true, 'A data é obrigatória']
  },
  hora: {
    type: String,
    required: [true, 'A hora é obrigatória']
  },
  local: {
    type: String,
    required: [true, 'O local é obrigatório']
  },
  imagem: {
    type: String,
    default: 'media/hero.png'
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  clima: {
    temp: String,
    desc: String,
    icon: String
  },
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
