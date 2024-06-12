import { BusListener } from "../lib/bus"
import { SeededRandom } from "./SeedRandom"
import {
	TetrominoeShape,
	TetrominoeType,
	getTetrominoeShape,
	createTetrominoeGenerator,
} from "./Tetrominoe"
import { UserInputAction } from "./UserInput"

const EmptyCell = -1

type FieldCell = TetrominoeType | typeof EmptyCell

function createField(width: number, height: number): FieldCell[][] {
	return Array.from({ length: height }, () =>
		Array.from({ length: width }, () => EmptyCell),
	)
}

type StepResult =
	| { type: "gameover" }
	| { type: "falling"; nextPosition: { x: number; y: number } }
	| { type: "placed"; burnedRows: number }

function hasCollision(
	field: FieldCell[][],
	tetrominoeShape: TetrominoeShape,
	tetrominoePosition: { x: number; y: number },
): boolean {
	for (let y = 0; y < tetrominoeShape.length; y++) {
		for (let x = 0; x < tetrominoeShape[y].length; x++) {
			if (tetrominoeShape[y][x] !== 0) {
				const fieldY = tetrominoePosition.y + y
				const fieldX = tetrominoePosition.x + x

				if (fieldY >= field.length || fieldX >= field[0].length) {
					return true
				}

				if (field[fieldY][fieldX] !== EmptyCell) {
					return true
				}
			}
		}
	}

	return false
}

function placeShape(
	field: FieldCell[][],
	tetrominoeType: TetrominoeType,
	tetrominoeShape: TetrominoeShape,
	tetrominoePosition: { x: number; y: number },
): number {
	let burnedRows = 0

	for (let y = 0; y < tetrominoeShape.length; y++) {
		const fieldY = tetrominoePosition.y + y
		for (let x = 0; x < tetrominoeShape[y].length; x++) {
			const fieldX = tetrominoePosition.x + x
			if (tetrominoeShape[y][x] !== 0) {
				field[fieldY][fieldX] = tetrominoeType
			}
		}

		if (field[fieldY].every((cell) => cell !== EmptyCell)) {
			field.splice(fieldY, 1)
			field.unshift(
				Array.from({ length: field[0].length }, () => EmptyCell),
			)
			burnedRows++
		}
	}

	return burnedRows
}

function simulateStep(
	field: FieldCell[][],
	tetrominoeType: TetrominoeType,
	tetrominoeShape: TetrominoeShape,
	tetrominoePosition: { x: number; y: number },
): StepResult {
	const nextPosition = {
		x: tetrominoePosition.x,
		y: tetrominoePosition.y + 1,
	}

	if (hasCollision(field, tetrominoeShape, nextPosition)) {
		if (tetrominoePosition.y === 0) {
			return { type: "gameover" }
		}

		const burnedRows = placeShape(
			field,
			tetrominoeType,
			tetrominoeShape,
			tetrominoePosition,
		)

		return { type: "placed", burnedRows }
	}

	return { type: "falling", nextPosition }
}

type GameState = "playing" | "gameover" | "paused"

interface LevelState {
	field: FieldCell[][]
	score: number
	currentTetrominoe: TetrominoeType
	tetrominoePosition: { x: number; y: number }
	nextTetrominoes: TetrominoeType[]
	state: GameState
	speed: number
	totalBurnedRows: number
}

export interface LevelConfig {
	width: number
	height: number
	speed: number
	nextTetrominoesCount: number
	seed: number
	scoring: Record<number, number>
}

function validateConfig(config: LevelConfig): asserts config is LevelConfig {
	if (config.nextTetrominoesCount < 1) {
		throw new Error("nextTetrominoesCount must be at least 1")
	}
	if (config.speed <= 0) {
		throw new Error("speed must be greater than 0")
	}
	if (config.width < 4) {
		throw new Error("width must be at least 4")
	}
	if (config.height < 4) {
		throw new Error("height must be at least 4")
	}
	for (let i = 1; i <= 4; i++) {
		if (!config.scoring[i]) {
			throw new Error(`scoring must contain a value for ${i} burned rows`)
		}
	}
}

export function level(
	config: LevelConfig,
	userInputBus: BusListener<UserInputAction>,
	onNextLevelState: (level: LevelState) => void,
) {
	validateConfig(config)

	const field = createField(config.width, config.height)
	const centerX = Math.floor(config.width / 2)

	let score = 0
	const rnd = new SeededRandom(config.seed)
	const tetrominoes = createTetrominoeGenerator(rnd)

	let currentTetrominoe = tetrominoes.next().value
	let nextTetrominoes: TetrominoeType[] = []
	for (let i = 0; i < config.nextTetrominoesCount; i++) {
		nextTetrominoes.push(tetrominoes.next().value)
	}

	let state = "playing" as GameState
	let tetrominoePosition = { x: centerX, y: 0 }
	let tetrominoeShape = getTetrominoeShape(currentTetrominoe)
	let speed = config.speed
	let totalBurnedRows = 0

	const isGameOver = () => state === "gameover"

	const getState = (): LevelState => ({
		field,
		score,
		currentTetrominoe,
		tetrominoePosition,
		nextTetrominoes,
		state,
		speed,
		totalBurnedRows,
	})

	const createUserInputHandler =
		<T>(callback: (value: T) => void) =>
		(action: T) => {
			if (state === "playing") {
				callback(action)
				onNextLevelState(getState())
			}
		}

	const userInputSubscriptions = [
		userInputBus.on(
			"move",
			createUserInputHandler((action) => {
				const nextPosition = { ...tetrominoePosition }
				if (action.direction === "left") {
					nextPosition.x--
				}
				if (action.direction === "right") {
					nextPosition.x++
				}
				if (action.direction === "down") {
					nextPosition.y++
				}

				if (!hasCollision(field, tetrominoeShape, nextPosition)) {
					tetrominoePosition = nextPosition
				}
			}),
		),
		userInputBus.on(
			"rotate",
			createUserInputHandler(() => {
				const rotated = getTetrominoeShape(currentTetrominoe)
				while (hasCollision(field, rotated, tetrominoePosition)) {
					tetrominoePosition.y--
				}
				tetrominoeShape = rotated
			}),
		),
		userInputBus.on(
			"drop",
			createUserInputHandler(() => {
				while (
					!hasCollision(field, tetrominoeShape, {
						...tetrominoePosition,
						y: tetrominoePosition.y + 1,
					})
				) {
					tetrominoePosition.y++
				}
			}),
		),
		userInputBus.on(
			"pause",
			createUserInputHandler(() => {
				state = state === "paused" ? "playing" : "paused"
			}),
		),
	]

	function update() {
		if (state !== "playing") {
			return
		}

		const result = simulateStep(
			field,
			currentTetrominoe,
			tetrominoeShape,
			tetrominoePosition,
		)

		if (result.type === "gameover") {
			state = "gameover"
			userInputSubscriptions.forEach((sub) => sub.unsubscribe())
			return
		}

		if (result.type === "placed") {
			totalBurnedRows += result.burnedRows
			score += config.scoring[result.burnedRows]
			currentTetrominoe = nextTetrominoes.shift()!
			nextTetrominoes.push(tetrominoes.next().value)
			tetrominoePosition = { x: centerX, y: 0 }
			tetrominoeShape = getTetrominoeShape(currentTetrominoe)
		}

		if (result.type === "falling") {
			tetrominoePosition = result.nextPosition
		}

		onNextLevelState(getState())
	}

	function tick() {
		update()
		if (!isGameOver()) {
			setTimeout(tick, 2000 / speed)
		}
	}

	return {
		start() {
			tick()
		},
		stop() {
			state = "gameover"
			update()
		},
	}
}
