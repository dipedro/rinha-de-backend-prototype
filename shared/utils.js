function isValidPositiveNumber(value) {
  return (typeof value === "number" && Number.isInteger(value) && value > 0);
}

module.exports = {
  isValidPositiveNumber
}