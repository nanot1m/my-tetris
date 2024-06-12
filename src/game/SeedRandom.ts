export class SeededRandom {
	private seed: number

	constructor(seed: number) {
		this.seed = seed
	}

	// LCG constants
	private static readonly A = 1664525
	private static readonly C = 1013904223
	private static readonly MOD = 2 ** 32

	// Generate next number in sequence
	next(): number {
		this.seed =
			(SeededRandom.A * this.seed + SeededRandom.C) % SeededRandom.MOD
		return this.seed / SeededRandom.MOD
	}

	// Generate a number in a specific range
	nextInt(min: number, max: number): number {
		return Math.floor(this.next() * (max - min + 1)) + min
	}
}
