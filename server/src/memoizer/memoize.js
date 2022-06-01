const memoize = (fn) => {
  const cache = new Map();

  return (opt1, opt2) => {
    const key = `${opt1}-${opt2}`;

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(opt1, opt2);
    cache.set(key, result);

    return result;
  };
};

module.exports = { memoize };
