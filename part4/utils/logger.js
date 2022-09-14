const info = async (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    await console.log(...params)
  }
}

const error = async (...params) => {
  await console.log(...params)
}

module.exports = {
  info, error,
}
