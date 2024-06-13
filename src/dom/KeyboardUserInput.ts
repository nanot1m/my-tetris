import { UserInputAction } from "../game/UserInput"
import { createBus } from "../lib/bus"

export function createKeyboardUserInputBus(container: HTMLElement) {
	const bus = createBus<UserInputAction>()

	const handleKeyboardEvent = (event: KeyboardEvent): void => {
		switch (event.key) {
			case "ArrowLeft": {
				event.preventDefault()
				bus.dispatch({ type: "move", direction: "left" })
				break
			}
			case "ArrowRight": {
				event.preventDefault()
				bus.dispatch({ type: "move", direction: "right" })
				break
			}
			case "ArrowDown": {
				event.preventDefault()
				bus.dispatch({ type: "move", direction: "down" })
				break
			}
			case "ArrowUp": {
				event.preventDefault()
				bus.dispatch({ type: "rotate", direction: "clockwise" })
				break
			}
			case " ": {
				event.preventDefault()
				bus.dispatch({ type: "drop" })
				break
			}
			case "Escape":
			case "Enter": {
				event.preventDefault()
				bus.dispatch({ type: "pause" })
				break
			}
		}
	}

	container.addEventListener("keydown", handleKeyboardEvent)

	return {
		bus,
		destroy() {
			container.removeEventListener("keydown", handleKeyboardEvent)
		},
	}
}
