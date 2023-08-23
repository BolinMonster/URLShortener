/**
 * Generate random string with length specified
 * @param {*} length 
 * @returns 
 */
let randomString = (length) => {
	const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
	let s = ''
	for (let i = 0; i < length; i++) {
		s += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return s
}
module.exports.randomString = randomString