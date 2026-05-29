const Subscriber = require('../models/Subscriber');

exports.subscribe = async (req, res) => {
  try {
    const subscriber = await Subscriber.create(req.body);
    res.status(201).json({ success: true, message: 'Subscrição efetuada com sucesso' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Este email já está subscrito.' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getSubscribers = async (req, res) => {
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: subs.length, data: subs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteSubscriber = async (req, res) => {
  try {
    const sub = await Subscriber.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: 'Subscritor não encontrado' });
    res.status(200).json({ success: true, message: 'Subscritor removido' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
