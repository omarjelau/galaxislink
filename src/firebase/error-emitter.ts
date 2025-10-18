
type Listener<T> = (data: T) => void;

class EventEmitter<T> {
  private listeners: Map<string, Set<Listener<T>>> = new Map();

  on(event: string, listener: Listener<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off(event: string, listener: Listener<T>): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(listener);
    }
  }

  emit(event: string, data: T): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(listener => {
        try {
          listener(data);
        } catch (e) {
          console.error(`Error in listener for event "${event}":`, e);
        }
      });
    }
  }
}

// Singleton instance of EventEmitter for FirestorePermissionError
export const errorEmitter = new EventEmitter<Error>();
