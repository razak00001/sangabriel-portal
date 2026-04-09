const RateConfig = require('../models/RateConfig');

exports.createRate = async (req, res) => {
  try {
    const { title, type, rate, currency } = req.body;
    
    // Deactivate previous active rate of the same title/type if versioning
    // For simplicity, just create new one
    const rateConfig = new RateConfig({
      title,
      type,
      rate,
      currency,
      createdBy: req.user._id
    });
    
    await rateConfig.save();
    res.status(201).send(rateConfig);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getRates = async (req, res) => {
  try {
    const rates = await RateConfig.find({ isActive: true }).sort({ createdAt: -1 });
    res.send(rates);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.updateRate = async (req, res) => {
  try {
    const rateConfig = await RateConfig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rateConfig) {
      return res.status(404).send({ error: 'Rate not found' });
    }
    res.send(rateConfig);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
