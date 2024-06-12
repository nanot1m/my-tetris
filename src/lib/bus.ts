export interface Listener {
	unsubscribe(): void
}

export interface BusListener<T extends { type: string }> {
	on<Type extends T["type"]>(
		eventType: Type,
		callback: (event: Extract<T, { type: Type }>) => void,
	): Listener
}

export interface BusDispatcher<T extends { type: string }> {
	dispatch(event: T): void
}

export interface Bus<T extends { type: string }>
	extends BusListener<T>,
		BusDispatcher<T> {}

export function createBus<T extends { type: string }>(): Bus<T> {
	const listeners = new Map<string, Set<(event: any) => void>>()

	return {
		on(eventType, callback) {
			const set = listeners.get(eventType) ?? new Set()
			set.add(callback)
			listeners.set(eventType, set)

			return {
				unsubscribe() {
					set.delete(callback)
				},
			}
		},
		dispatch(event) {
			const set = listeners.get(event.type)
			if (set) {
				for (const callback of set) {
					callback(event)
				}
			}
		},
	}
}
