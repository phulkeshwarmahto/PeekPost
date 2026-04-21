export const truncate = (value, length = 140) => {
  if (!value) return "";
  return value.length > length ? `${value.slice(0, length)}...` : value;
};