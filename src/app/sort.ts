export const sortStringsAndNumbers = (a, b, sortBy) => {
  if (typeof a[sortBy] === "string" && typeof b[sortBy] === "string") {
    return a[sortBy].localeCompare(b[sortBy]);
  } else {
    return a[sortBy] - b[sortBy];
  }
};
