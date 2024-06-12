export type UserInputAction =
	| { type: "move"; direction: "left" | "right" | "down" }
	| { type: "rotate"; direction: "clockwise" }
	| { type: "drop" }
	| { type: "pause" }

