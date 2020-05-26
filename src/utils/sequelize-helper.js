function toPoint({ latitude, longitude }) {
  if (longitude == null && latitude == null) return undefined;

  return `${latitude}, ${longitude}`;
}

module.exports = {
  toPoint,
};
