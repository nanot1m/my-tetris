import { EmptyCell, LevelConfig, LevelState } from "../game/Level"
import {
	TetrominoeShape,
	TetrominoeType,
	getTetrominoeShape,
} from "../game/Tetrominoe"

const colors = {
	[EmptyCell]: "#000000",
	[TetrominoeType.I]: "#00FFFF",
	[TetrominoeType.J]: "#0000FF",
	[TetrominoeType.L]: "#FFA500",
	[TetrominoeType.O]: "#FFFF00",
	[TetrominoeType.S]: "#00FF00",
	[TetrominoeType.T]: "#800080",
	[TetrominoeType.Z]: "#FF0000",
}

const cellSize = 20

export function createDomRenderer(
	rootDomElement: HTMLElement,
	levelConfig: LevelConfig,
) {
	const fieldContainer = document.createElement("canvas")
	fieldContainer.width = levelConfig.width * cellSize
	fieldContainer.height = levelConfig.height * cellSize

	const scoreContainer = document.createElement("div")
	scoreContainer.style.fontSize = "24px"
	scoreContainer.style.fontWeight = "bold"
	scoreContainer.style.fontFamily = "monospace"
	scoreContainer.style.textAlign = "right"
	scoreContainer.style.gridArea = "score"

	const nextTetrominoesContainer = document.createElement("canvas")
	nextTetrominoesContainer.width = 4 * cellSize
	nextTetrominoesContainer.height =
		levelConfig.nextTetrominoesCount * 4 * cellSize

	rootDomElement.appendChild(scoreContainer)
	rootDomElement.appendChild(fieldContainer)
	rootDomElement.appendChild(nextTetrominoesContainer)

	function renderCell(
		x: number,
		y: number,
		color: string,
		ctx: CanvasRenderingContext2D,
	) {
		ctx.fillStyle = color
		ctx.fillRect(
			x * cellSize + 1,
			y * cellSize + 1,
			cellSize - 1,
			cellSize - 1,
		)
	}

	function renderScore(state: LevelState) {
		scoreContainer.textContent = `${state.score}`
	}

	function renderTetrominoe(
		tetrominoeShape: TetrominoeShape,
		tetrominoeType: TetrominoeType,
		tetrominoePosition: { x: number; y: number },
		ctx: CanvasRenderingContext2D,
	) {
		for (let y = 0; y < tetrominoeShape.length; y++) {
			const fieldY = tetrominoePosition.y + y
			for (let x = 0; x < tetrominoeShape[y]!.length; x++) {
				const fieldX = tetrominoePosition.x + x
				if (tetrominoeShape[y]![x]) {
					const color = colors[tetrominoeType]
					renderCell(fieldX, fieldY, color, ctx)
				}
			}
		}
	}

	function renderField(state: LevelState, ctx: CanvasRenderingContext2D) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		const {
			field,
			tetrominoePosition,
			tetrominoeShape,
			currentTetrominoe: tetrominoeType,
		} = state

		for (let y = 0; y < field.length; y++) {
			for (let x = 0; x < field[y]!.length; x++) {
				const color = colors[field[y]![x]!]
				renderCell(x, y, color, ctx)
			}
		}

		renderTetrominoe(
			tetrominoeShape,
			tetrominoeType,
			tetrominoePosition,
			ctx,
		)
	}

	function renderNextTetrominoes(
		state: LevelState,
		ctx: CanvasRenderingContext2D,
	) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		const { nextTetrominoes } = state

		nextTetrominoes.forEach((tetrominoe, index) => {
			for (let y = 0; y < 4; y++) {
				for (let x = 0; x < 4; x++) {
					const color = colors[EmptyCell]
					renderCell(x, y + index * 4, color, ctx)
				}
			}
			const shape = getTetrominoeShape(tetrominoe)
			renderTetrominoe(shape, tetrominoe, { x: 0, y: index * 4 }, ctx)
		})
	}

	const fieldContext = fieldContainer.getContext("2d")
	if (!fieldContext) {
		throw new Error("Canvas 2d context not supported")
	}

	const nextTetrominoesContext = nextTetrominoesContainer.getContext("2d")
	if (!nextTetrominoesContext) {
		throw new Error("Canvas 2d context not supported")
	}

	return {
		onNextLevelState: (state: LevelState) => {
			renderScore(state)
			renderField(state, fieldContext)
			renderNextTetrominoes(state, nextTetrominoesContext)
		},
	}
}
