/**
 * Get element by id
 * @param {String} id Uuid of element
 * @returns Element with the given id
 */
export const findById = (id) => (list) => list.flatMap((item) => (item.children ? [item, ...item.children] : item)).find((item) => item.uuid === id);

/**
 * Filter a list of objects with the name that starts with the given string.
 * @param {String} name The name of the objects to find
 * @returns {Array} A list of objects with the given name
 */
export const filterStartsWithName = (name) => (list) =>
  list.flatMap((item) => (item.children ? [item, ...item.children] : item)).filter((item) => item.name.startsWith(name));

/**
 * Filter a list of objects with the given name
 * @param {String} name The name of the object to find
 * @returns {Array} A list of objects with that name
 */
export const filterByName = (name) => (list) =>
  list.flatMap((item) => (item.children ? [item, ...item.children] : item)).filter((item) => item.name.includes(name));

/**
 * Get the maximum counter of the objects with the given name.
 * @param {Array} list
 * @returns {Number} The highest counter of the given list
 */
export const getMaxCounter = (list) => list.map((item) => item.name[item.name.length - 1]).reduce((a, b) => (a > b ? a : b), 0);

export const filterObjectByName = (name) => (list) => list.filter((item) => item.objectName.startsWith(name));

export const groupByMeasure = (array, key) => {
  return array.reduce(function (r, a, i) {
    if (!i || r[r.length - 1][0][key].substring(0, 8) !== a[key].substring(0, 8)) {
      return r.concat([[a]]);
    }
    r[r.length - 1].push(a);
    return r;
  }, []);
};
