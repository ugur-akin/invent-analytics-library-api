class ResourceNotFoundError extends Error {
  constructor(resource, id) {
    const msg = `${resource} ${id} Not Found`;
    super(msg);
  }
}

module.exports = { ResourceNotFoundError };
