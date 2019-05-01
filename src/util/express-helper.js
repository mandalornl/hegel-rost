import isPlainObject from 'lodash/isPlainObject';

/**
 * Wrap async function into middleware
 *
 * @param {Function} fn
 *
 * @returns {Function}
 */
export const api = fn =>
{
  return (req, res, next) =>
  {
    fn(req, res, next)
      .then(result => res.json(result))
      .catch(exception =>
      {
        console.error(exception);

        res.status(exception.status || 500).json(isPlainObject(exception) ? exception : exception.toString());
      });
  };
};

/**
 * Wrap async function into middleware
 *
 * @param {Function} fn
 *
 * @returns {Function}
 */
export const catchExceptions = fn =>
{
  return (req, res, next) =>
  {
    fn(req, res, next)
      .catch(exception =>
      {
        console.error(exception);

        res.status(exception.status || 500).json(isPlainObject(exception) ? exception : exception.toString());
      });
  };
};
