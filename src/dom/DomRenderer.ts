import { EmptyCell, LevelConfig, LevelState } from "../game/Level"
import {
	TetrominoeShape,
	TetrominoeType,
	getTetrominoeShape,
} from "../game/Tetrominoe"

const colors = {
	[EmptyCell]: "#2a2a2a",
	[TetrominoeType.I]: "#00FFFF",
	[TetrominoeType.J]: "#0000FF",
	[TetrominoeType.L]: "#FFA500",
	[TetrominoeType.O]: "#FFFF00",
	[TetrominoeType.S]: "#00FF00",
	[TetrominoeType.T]: "#800080",
	[TetrominoeType.Z]: "#FF0000",
}

const cellSize = 20
const previewCellSize = 15

function adoptScreenPixelRatio(ctx: CanvasRenderingContext2D) {
	const ratio = window.devicePixelRatio || 1

	const oldWidth = ctx.canvas.width
	const oldHeight = ctx.canvas.height

	ctx.canvas.width = oldWidth * ratio
	ctx.canvas.height = oldHeight * ratio

	ctx.canvas.style.width = `${oldWidth}px`
	ctx.canvas.style.height = `${oldHeight}px`

	ctx.scale(ratio, ratio)
}

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
	nextTetrominoesContainer.width = 4 * previewCellSize
	nextTetrominoesContainer.height =
		levelConfig.nextTetrominoesCount * 4 * previewCellSize

	rootDomElement.appendChild(scoreContainer)
	rootDomElement.appendChild(fieldContainer)
	rootDomElement.appendChild(nextTetrominoesContainer)

	function renderCell(
		x: number,
		y: number,
		color: string,
		size: number,
		ctx: CanvasRenderingContext2D,
	) {
		ctx.fillStyle = color
		ctx.fillRect(x * size, y * size, size, size)
	}

	function renderTetrominoeCell(
		x: number,
		y: number,
		color: string,
		size: number,
		ctx: CanvasRenderingContext2D,
	) {
		renderCell(x, y, colors[EmptyCell], size, ctx)

		ctx.strokeStyle = color
		ctx.strokeRect(x * size + 1, y * size + 1, size - 1, size - 1)

		ctx.strokeRect(x * size + 3, y * size + 3, size - 6, size - 6)

		ctx.fillStyle = color
		ctx.fillRect(x * size + 5, y * size + 5, size - 8, size - 8)
	}

	function renderScore(state: LevelState) {
		scoreContainer.textContent = `${state.score}`
	}

	function renderTetrominoe(
		tetrominoeShape: TetrominoeShape,
		tetrominoeType: TetrominoeType,
		tetrominoePosition: { x: number; y: number },
		size: number,
		ctx: CanvasRenderingContext2D,
	) {
		for (let y = 0; y < tetrominoeShape.length; y++) {
			const fieldY = tetrominoePosition.y + y
			for (let x = 0; x < tetrominoeShape[y]!.length; x++) {
				const fieldX = tetrominoePosition.x + x
				if (tetrominoeShape[y]![x]) {
					const color = colors[tetrominoeType]
					renderTetrominoeCell(fieldX, fieldY, color, size, ctx)
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
				if (field[y]![x] !== EmptyCell) {
					renderTetrominoeCell(x, y, color, cellSize, ctx)
				} else {
					renderCell(x, y, color, cellSize, ctx)
				}
			}
		}

		renderTetrominoe(
			tetrominoeShape,
			tetrominoeType,
			tetrominoePosition,
			cellSize,
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
					renderCell(x, y + index * 4, color, previewCellSize, ctx)
				}
			}
			const shape = getTetrominoeShape(tetrominoe)
			const p = (4 - shape.length) / 2
			renderTetrominoe(
				shape,
				tetrominoe,
				{ x: p, y: index * 4 + p },
				previewCellSize,
				ctx,
			)
		})
	}

	const fieldContext = fieldContainer.getContext("2d")
	if (!fieldContext) {
		throw new Error("Canvas 2d context not supported")
	}
	adoptScreenPixelRatio(fieldContext)

	const nextTetrominoesContext = nextTetrominoesContainer.getContext("2d")
	if (!nextTetrominoesContext) {
		throw new Error("Canvas 2d context not supported")
	}
	adoptScreenPixelRatio(nextTetrominoesContext)

	return {
		onNextLevelState: (state: LevelState) => {
			renderScore(state)
			renderField(state, fieldContext)
			renderNextTetrominoes(state, nextTetrominoesContext)
		},
	}
}
