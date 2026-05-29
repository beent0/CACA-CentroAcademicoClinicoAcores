const User = require('../models/User');

const sanitizar = (user) => ({
  _id: user._id, 
  nome: user.nome, 
  email: user.email,
  telemovel: user.telemovel, 
  role: user.role, 
  bio: user.bio,
  createdAt: user.createdAt,
});

exports.getUsers = async (req, res) => {
  try {
    const utilizadores = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      total: utilizadores.length,
      utilizadores: utilizadores.map(sanitizar),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!['regular', 'admin'].includes(role)) {
    return res.status(422).json({ success: false, message: 'Role inválido. Use "regular" ou "admin".' });
  }
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'Não pode alterar o seu próprio role.' });
  }

  try {
    const utilizador = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!utilizador) return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
    res.status(200).json({ success: true, utilizador: sanitizar(utilizador) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'Não pode eliminar a sua própria conta.' });
  }

  try {
    const utilizador = await User.findByIdAndDelete(req.params.id);
    if (!utilizador) return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
    res.status(200).json({ success: true, message: 'Utilizador eliminado com sucesso.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
