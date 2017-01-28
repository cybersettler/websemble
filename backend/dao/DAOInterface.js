/**
 * The methods of this class should be implemented
 * by DAO.
 * @interface DAOInterface
 */

/**
 * Create resource.
 * @function
 * @name DAOInterface#insert
 * @param {Object} data - Resource data.
 * @returns {Promise} A promise that resolves to the created resource.
 */

/**
 * Find all resources.
 * @function
 * @name DAOInterface#find
 * @param {Object} [query] - A query object.
 * @param {Object} [options] - An options object.
 * @returns {Promise} A promise that resolves to an array of found resources.
 */

/**
 * Find by resource id.
 * @function
 * @name DAOInterface#findOne
 * @param {Object} query - A query object.
 * @returns {Promise} A promise that resolves to
 * the found resource or null.
 */

/**
 * Update resource overwritting existing data.
 * @function
 * @name DAOInterface#update
 * @param {string} id - Resource id, required.
 * @param {Object} [query] - A query object.
 * @param {Object} update - Attributes to be updated.
 * @param {Object} [options] - An options object.
 * @returns {Promise} A promise that resolves to number of affected documents.
 */

/**
 * Delete resource.
 * @function
 * @name DAOInterface#remove
 * @param {Object} [query] - A query object.
 * @param {Object} [options] - An options object.
 * @returns {Promise} A promise that resolves to number of affected documents.
 */

/**
 * Schema query.
 * @function
 * @name DAOInterface#getSchema
 * @returns {Object} JSON schema.
 */
