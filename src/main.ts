import { createDomRenderer } from "./dom/DomRenderer"
import { createKeyboardUserInputBus } from "./dom/KeyboardUserInput"
import { LevelConfig, createLevel } from "./game/Level"
import "./style.css"

const appNode = document.querySelector<HTMLDivElement>("#app")!

const levelConfig: LevelConfig = {
	width: 10,
	height: 20,
	nextTetrominoesCount: 3,
	scoring: {
		[0]: 0,
		[1]: 40,
		[2]: 100,
		[3]: 300,
		[4]: 1200,
	},
	seed: Date.now(),
	speed: 1,
}

const keyboardInput = createKeyboardUserInputBus(document.body)

const renderer = createDomRenderer(appNode, levelConfig)
const level = createLevel(levelConfig, keyboardInput.bus, (state) =>
	renderer.onNextLevelState(state),
)

level.start()
