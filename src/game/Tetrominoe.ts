import { SeededRandom } from "./SeedRandom"

export type TetrominoeShape = readonly (readonly number[])[]

export const enum TetrominoeType {
	/**
	 * - [] -
	 * - [] -
	 * - [] -
	 * - [] -
	 */
	I = 0,

	/**
	 * - - [] -
	 * - - [] -
	 * - [][] -
	 */
	J = 1,

	/**
	 * - [] -
	 * - [] -
	 * - [][]
	 */
	L = 2,

	/**
	 * - [][] -
	 * - [][] -
	 */
	O = 3,

	/**
	 * - [][] -
	 * [][] -
	 */
	S = 4,

	/**
	 * [][][]
	 * - [] -
	 */
	T = 5,

	/**
	 * [][] -
	 * - [][] -
	 */
	Z = 6,
}

const Tetrominoes = [
	[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	],
	[
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
	],
	[
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0],
	],
	[
		[1, 1],
		[1, 1],
	],
	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0],
	],
	[
		[1, 1, 1],
		[0, 1, 0],
		[0, 0, 0],
	],
	[
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0],
	],
] as const satisfies TetrominoeShape[]

export const getTetrominoeShape = (type: TetrominoeType): TetrominoeShape =>
	Tetrominoes[type]

export function rotateTetrominoeCW(
	tetrominoe: TetrominoeShape,
): TetrominoeShape {
	// Assume the tetrominoe is square
	const size = tetrominoe.length
	const rotated = new Array(size).fill(0).map(() => new Array(size).fill(0))

	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			rotated[i][j] = tetrominoe[size - j - 1][i]
		}
	}

	return rotated
}

const TetrominoeTypes = [
	TetrominoeType.I,
	TetrominoeType.J,
	TetrominoeType.L,
	TetrominoeType.O,
	TetrominoeType.S,
	TetrominoeType.T,
] as const satisfies TetrominoeType[]

export function* createTetrominoeGenerator(
	rnd: SeededRandom,
): Generator<TetrominoeType, TetrominoeType, TetrominoeType> {
	let bag = [...TetrominoeTypes]
	while (true) {
		if (bag.length === 0) {
			bag = [...TetrominoeTypes]
		}
		const index = rnd.nextInt(0, bag.length - 1)
		yield bag.splice(index, 1)[0]
	}
}
