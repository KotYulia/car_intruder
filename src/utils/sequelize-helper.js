function toPoint({ longitude, latitude }) {
  if (longitude == null && latitude == null) return undefined;

  return `point(${longitude}, ${latitude})`;
}

module.exports = {
  toPoint,
};
