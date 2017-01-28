/**
 * Configuration passed to Datastore constructor
 * should implement this interface.
 * @interface DatastoreConfigInterface
 */

/**
 * Collection name.
 * @typedef {string} DatastoreConfigInterface#name
 */

/**
 * Collection schema.
 * @typedef {string} DatastoreConfigInterface#schema
 */

/**
 * Path to the
 * file where the data is persisted. If left blank,
 * the datastore is automatically considered in-memory
 * only. It cannot end with a ~ which is used in the
 * temporary files NeDB uses to perform crash-safe writes.
 * @typedef {string} DatastoreConfigInterface#filename
 */

/**
 * Defaults to false, as the name implies.
 * @typedef {boolean} DatastoreConfigInterface#inMemoryOnly
 */

/**
 * Defaults to
 * false. Timestamp the insertion and last update of all documents,
 * with the fields createdAt and updatedAt. User-specified
 * values override automatic generation, usually useful
 * for testing.
 * @typedef {boolean} DatastoreConfigInterface#timestampData
 */

/**
 * Defaults to false.
 * If used, the database will automatically be loaded from
 * the datafile upon creation (you don't need to call
 * loadDatabase. Any command issued before load is finished
 * is buffered and will be executed when load is done.
 * @typedef {boolean} DatastoreConfigInterface#autoload
 */

/**
 * If you use autoloading,
 * this is the handler called after the loadDatabase.
 * It takes one error argument. If you use autoloading without
 * specifying this handler, and an error happens during load,
 * an error will be thrown.
 * @function
 * @name DatastoreConfigInterface#onload
 * @param {Object} error - Loading error.
 */

/**
 * Hook you can use
 * to transform data after it was serialized and before it is
 * written to disk. Can be used for example to encrypt data
 * before writing database to disk.
 * @function
 * @name DatastoreConfigInterface#afterSerialization
 * @param {string} line -  A line of an NeDB data file.
 * @return {string} Outputs the transformed string,
 * which must absolutely not contain a \n character
 * (or data will be lost).
 */

/**
 * Inverse of
 * afterSerialization. Make sure to include both and not just
 * one or you risk data loss. For the same reason, make sure
 * both functions are inverses of one another. Some failsafe
 * mechanisms are in place to prevent data loss if you misuse
 * the serialization hooks: NeDB checks that never one is
 * declared without the other, and checks that they are reverse
 * of one another by testing on random strings of various lengths.
 * In addition, if too much data is detected as corrupt, NeDB will
 * refuse to start as it could mean you're not using the
 * deserialization hook corresponding to the serialization hook
 * used before.
 * @function
 * @name DatastoreConfigInterface#beforeDeserialization
 */

/**
 * A number between 0 and 1,
 * defaults to 10%. NeDB will refuse to start if more than this
 * percentage of the datafile is corrupt. 0 means you don't tolerate
 * any corruption, 1 means you don't care.
 * @typedef {number} DatastoreConfigInterface#corruptAlertThreshold
 */

/**
 * Compares strings a and b and return -1, 0 or 1. If specified,
 * it overrides default string comparison which is not well adapted
 * to non-US characters in particular accented letters. Native
 * localCompare will most of the time be the right choice.
 * @function
 * @name DatastoreConfigInterface#compareStrings
 * @param {string} a - String to be compared.
 * @param {string} b - String to be compared.
 * @return {number} -1, 0 or 1.
 */
