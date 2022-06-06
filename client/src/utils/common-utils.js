export const findById = (id) => (list) => list.flatMap((item) => (item.children ? [item, ...item.children] : item)).find((item) => item.uuid === id);
