// No persistent storage needed for this application
// All processing is stateless and session-based

export interface IStorage {
  // Placeholder interface for consistency
}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
