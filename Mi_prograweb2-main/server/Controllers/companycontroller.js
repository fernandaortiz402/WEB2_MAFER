const Studios = require('../Models/Model_company');

const getStudios = async (req, res) => {
  try {
    const studios = await Studios.find().sort({ Nombre_Estudio: 1 });
    
    res.json({
      success: true,
      studios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener los estudios'
    });
  }
};

module.exports = {
  getStudios
};