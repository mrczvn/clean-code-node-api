const expressRouterAdapter = () => {
  return {
    adapt: (router) => {
      return async (req, res) => {
        const httpRequest = {
          body: req.body,
        };
        const { statusCode, body } = await router.route(httpRequest);

        res.status(statusCode).json(body);
      };
    },
  };
};

module.exports = expressRouterAdapter();
