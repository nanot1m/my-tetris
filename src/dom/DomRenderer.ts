import { EmptyCell, LevelConfig, LevelState } from "../game/Level"
import { TetrominoeType } from "../game/Tetrominoe"

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
	const nextTetrominoesContainer = document.createElement("div")

	rootDomElement.appendChild(fieldContainer)
	rootDomElement.appendChild(scoreContainer)
	rootDomElement.appendChild(nextTetrominoesContainer)

	function renderCell(
		x: number,
		y: number,
		color: string,
		ctx: CanvasRenderingContext2D,
	) {
		ctx.fillStyle = color
		ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
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
				if (field[y]![x]) {
					const color = colors[field[y]![x]!]
					renderCell(x, y, color, ctx)
				}
			}
		}

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

	const fieldContext = fieldContainer.getContext("2d")
	if (!fieldContext) {
		throw new Error("Canvas 2d context not supported")
	}

	return {
		onNextLevelState: (state: LevelState) => {
			console.log(state)
			renderField(state, fieldContext)
		},
	}
}
