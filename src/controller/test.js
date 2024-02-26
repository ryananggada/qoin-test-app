const { Test01 } = require('../models');
const { channel, queueName } = require('../worker');

exports.getOne = async (req, res) => {
  const testId = req.params.id;

  try {
    const data = await Test01.findOne({ where: { id: testId } });

    if (!data) {
      return res.status(404).json({ ok: false, message: 'Data not found.' });
    }

    return res.json({
      ok: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getAll = async (req, res) => {
  const { page } = req.query;

  try {
    const data = await Test01.findAndCountAll({
      offset: 20 * ((page ? page : 1) - 1),
      limit: 20,
    });

    return res.json({
      ok: true,
      data: data.rows,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.add = async (req, res) => {
  const { nama, status } = req.body;

  try {
    const result = await Test01.create({
      nama,
      status,
    });

    channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify({ command: 'create', data: { nama, status } }))
    );

    return res.json({ ok: true, data: result });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.edit = async (req, res) => {
  const testId = req.params.id;
  const { nama, status } = req.body;

  try {
    const data = await Test01.findOne({ where: { id: testId } });

    if (!data) {
      return res.status(404).json({ ok: false, message: 'Data not found.' });
    }

    data.nama = nama;
    data.status = status;
    await data.save();

    channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify({ command: 'update', data: { nama, status } }))
    );

    return res.json({ ok: true, data: data });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.delete = async (req, res) => {
  const testId = req.params.id;

  try {
    const data = await Test01.findOne({ where: { id: testId } });

    Test01.destroy({ where: { id: testId } }).then(function (rowDeleted, data) {
      if (rowDeleted === 1) {
        return res.json({
          ok: true,
          message: 'Data successfully deleted.',
        });
      }

      channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify({ command: 'delete', data: { rowDeleted } }))
      );

      return res.status(404).json({
        ok: false,
        message: 'Data not found.',
      });
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
