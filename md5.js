/*
 * This file is part of md5.js.
 *
 * md5.js is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * md5.js is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with md5.js.  If not, see <https://www.gnu.org/licenses/>.
 */

function md5(str)
{
	// Convert string to bytes
	var data = new TextEncoder("utf-8").encode(str);

	// Constants
	var s = new Uint32Array([
		7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
		5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
		4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
		6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21
	]);

	var K = new Uint32Array([
		0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
		0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
		0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
		0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
		0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
		0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
		0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
		0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
		0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
		0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
		0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
		0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
		0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
		0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
		0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
		0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
	]);

	// Initialize hash
	var hash = new Uint32Array([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);

	// Apply padding
	var padLength = data.length + 1;
	while (padLength % 64 != 56)
		padLength++;
	padLength += 8;

	var padData = new Uint8Array(padLength);
	for (var i = 0; i < data.length; i++)
		padData[i] = data[i];
	for (var i = data.length; i < padLength; i++)
		padData[i] = 0x0;

	// Append 1 bit
	padData[data.length] = 0x80;

	// Append original length
	var bits = data.length * 8;
	var upperLen = parseInt(bits.toString(16).slice(0, -8), 16);
	if (isNaN(upperLen))
		upperLen = 0;
	padData[padLength-8] = bits;
	padData[padLength-7] = bits >>> 8;
	padData[padLength-6] = bits >>> 16;
	padData[padLength-5] = bits >>> 24;
	padData[padLength-4] = upperLen;
	padData[padLength-3] = upperLen >>> 8;
	padData[padLength-2] = upperLen >>> 16;
	padData[padLength-1] = upperLen >>> 24;

	// Process the data in 64-byte chunks
	for (var i = 0; i < padLength; i += 64) {
		var M = new Uint32Array(16);
		for (var j = 0, offset = i; j < 16; j++, offset += 4)
			M[j] = padData[offset] + (padData[offset+1] << 8) + (padData[offset+2] << 16) + (padData[offset+3] << 24);

		// Main loop
		var chunk = new Uint32Array(hash);
		for (var j = 0; j < 64; j++) {
			var locals = new Uint32Array(2);
			if (j <= 15) {
				locals[0] = (chunk[1] & chunk[2]) | ((~chunk[1]) & chunk[3]);
				locals[1] = j;
			} else if (j <= 31) {
				locals[0] = (chunk[3] & chunk[1]) | ((~chunk[3]) & chunk[2]);
				locals[1] = (5 * j + 1) % 16;
			} else if (j <= 47) {
				locals[0] = chunk[1] ^ chunk[2] ^ chunk[3];
				locals[1] = (3 * j + 5) % 16;
			} else {
				locals[0] = chunk[2] ^ (chunk[1] | (~chunk[3]));
				locals[1] = (7 * j) % 16;
			}

			locals[0] += chunk[0] + K[j] + M[locals[1]];
			chunk[0] = chunk[3];
			chunk[3] = chunk[2];
			chunk[2] = chunk[1];
			chunk[1] += rotl(locals[0], s[j]);
		}

		// Add this chunk's hash to the main hash
		hash[0] += chunk[0];
		hash[1] += chunk[1];
		hash[2] += chunk[2];
		hash[3] += chunk[3];
	}

	// Convert to string
	var md5Str = "";
	for (var i = 0; i < 4; i++) {
		var bytes = new Uint8Array([hash[i], hash[i] >> 8, hash[i] >> 16, hash[i] >> 24]);
		for (var j = 0; j < 4; j++) {
			if (bytes[j] < 0x10)
				md5Str += "0";
			md5Str += bytes[j].toString(16);
		}
	}

	return md5Str;
}

// Bitwise left-rotate
function rotl(val, sft)
{
	return (val << sft) | (val >>> (32 - sft));
}

export { md5 };
