const expressRouterAdapter = () => {
  return {
    adapt: (route) => {
      return async (req, res) => {
        const httpRequest = {
          body: req.body,
        };
        const httpResponse = await route(httpRequest);
        res.status(httpRequest.statusCode).json(httpResponse.body);
      };
    },
  };
};

module.exports = expressRouterAdapter();
