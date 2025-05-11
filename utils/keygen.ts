import { createHash } from "crypto"

const KEYLENGTH = 13

export const hashPassword = (input: string) => { return createHash('sha1').update(input).digest('hex') }

export const keygen = {
   uid: () => {
		const letters = 'ucnmqsycafhnjrtzwtpeiokml',
			nums = '8346927015'
		let key = ''

		for (let i = 0; i < KEYLENGTH; i++) {
			const r = (((i+3)%4) == 0) ? true : false
			if (r) {
					key += nums[Math.floor(Math.random() * nums.length)]
			} else {
					const s = (((i-1)%5) == 0) ? true : false
					const index = Math.floor(Math.random() * letters.length)
					key += (s === true) ? letters[index].toUpperCase() : letters[index]
			}
		}
		return `UID${key}`
	},
	cid: () => {
		const letters = 'uciafcjrmlhqtzwtpenoksynm',
			nums = '3401596287'
		let key = ''

		for (let i = 0; i < KEYLENGTH; i++) {
			const r = (((i+3)%4) == 0) ? true : false
			if (r) {
					key += nums[Math.floor(Math.random() * nums.length)]
			} else {
					const s = (((i-1)%5) == 0) ? true : false
					const index = Math.floor(Math.random() * letters.length)
					key += (s === true) ? letters[index].toUpperCase() : letters[index]
			}
		}
		return `CID${key}`
	}
}

export const randomize = (threshold: number) => {
	if (threshold < 1) return -1;
	return (Math.floor(Math.random() * threshold))
}