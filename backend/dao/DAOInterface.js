/**
 * The methods of this class should be implemented
 * by DAO.
 * @interface DAOInterface
 */

/**
 * Create resource.
 * @function
 * @name DAOInterface#create
 * @param {Object} data - Resource data.
 * @returns {Promise} The created resource.
 */

/**
 * Find all resources.
 * @function
 * @name DAOInterface#findAll
 * @returns {Promise} An array of resources.
 */

/**
 * Find by resource id.
 * @function
 * @name DAOInterface#findById
 * @param {string} id - Resource id.
 * @returns {Promise} A resource object or null.
 */

/**
 * Find resources that match a condition.
 * @function
 * @name DAOInterface#findWhere
 * @param {Object} condition - Filter.
 * @returns {Promise} Array of resources.
 */

/**
 * Update resource overwritting existing data.
 * @function
 * @name DAOInterface#update
 * @param {string} id - Resource id, required.
 * @param {Object} data - Resource data.
 * @returns {Promise} Updated resource.
 */

/**
 * Update resource replacing only the given attributes.
 * @function
 * @name DAOInterface#updatePartially
 * @param {string} id - Resource id, required.
 * @param {Object} data - Resource data.
 * @returns {Promise} Updated resource.
 */

/**
 * Delete resource.
 * @function
 * @name DAOInterface#delete
 * @param {string} id - Resource id.
 * @returns {Promise} Number of deleted resources.
 */

/**
 * Schema query.
 * @function
 * @name DAOInterface#getSchema
 * @returns {Object} JSON schema.
 */
