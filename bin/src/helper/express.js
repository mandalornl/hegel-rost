/**
 * Handle request
 *
 * @param {function(e.Request, e.Response, e.NextFunction)} fn
 *
 * @returns {function(e.Request, e.Response, e.NextFunction): Promise<void>}
 */
export const handleRequest = (fn) => (
  async (req, res, next) => {
    try {
      const data = await fn(req, res, next);

      res.json(data);
    } catch (error) {
      console.error(error.message);

      res.status(error.status ?? 500).json({
        message: error.message
      });
    }
  }
);
