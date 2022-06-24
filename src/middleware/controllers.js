const controllers = (services) => {
  return async (req, res) => {
    try {
      const serviceControllers = await services(req);

      if (!serviceControllers.success) throw serviceControllers;
      return res.status(serviceControllers.statusCode || 200).json({
        message: serviceControllers.message,
        result: serviceControllers.data,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  };
};

module.exports = controllers;
