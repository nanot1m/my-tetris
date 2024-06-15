import { UserInputAction } from "../game/UserInput"
import { createBus } from "../lib/bus"

export function createUserInputBus(container: HTMLElement, cellSize: number) {
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

	let touchStartPos = { x: 0, y: 0 }

	function handleTouchStart(event: TouchEvent) {
		touchStartPos.x = event.touches[0]!.clientX
		touchStartPos.y = event.touches[0]!.clientY
	}

	function handleTouchMove(event: TouchEvent) {
		const touch = event.touches[0]!
		const dx = touch.clientX - touchStartPos.x
		const dy = touch.clientY - touchStartPos.y

		console.log({ dx, dy })
		if (Math.abs(dx) > Math.abs(dy)) {
			if (Math.abs(dx) < cellSize) return
			if (dx < 0) {
				bus.dispatch({ type: "move", direction: "left" })
			} else {
				bus.dispatch({ type: "move", direction: "right" })
			}
		} else {
			if (dy > cellSize) {
				bus.dispatch({ type: "move", direction: "down" })
			} else if (dy < -cellSize * 2) {
				bus.dispatch({ type: "rotate", direction: "clockwise" })
			} else {
                return
            }
		}

		touchStartPos.x = touch.clientX
		touchStartPos.y = touch.clientY
	}

	container.addEventListener("keydown", handleKeyboardEvent)
	container.addEventListener("touchstart", handleTouchStart)
	container.addEventListener("touchmove", handleTouchMove)

	return {
		bus,
		destroy() {
			container.removeEventListener("keydown", handleKeyboardEvent)
			container.removeEventListener("touchstart", handleTouchStart)
			container.removeEventListener("touchmove", handleTouchMove)
		},
	}
}
