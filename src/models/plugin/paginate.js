const { Op } = require("sequelize");

const paginatePlugin = async function (model, filter, options) {

  let orderTemp = [];
  const order = [];
  if (options.sortBy) {
    options.sortBy.split(',').forEach((sortOption) => {
      const [key, value] = sortOption.split(':');
      orderTemp.push(key);
      orderTemp.push((value === 'desc' ? 'desc' : 'asc'));
      order.push(orderTemp);
      orderTemp = [];
    });
  } else {
    order.push(['createdAt']);
  }

  const countPromise = await model.count({
    where: filter
  });

  const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;

  let page = 1;
  let offset = 0;
  if (countPromise > limit) {
    page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    offset = (page - 1) * limit;
  }
  options = {
    where: filter,
    order,
    limit,
    offset,
  };

  const docsPromise = await model.findAll(options);

  return Promise.all([countPromise, docsPromise]).then((values) => {
    const [totalResults, results] = values;
    const totalPages = Math.ceil(totalResults / limit);
    const result = {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
    return Promise.resolve(result);
  });
};

module.exports = { paginatePlugin };