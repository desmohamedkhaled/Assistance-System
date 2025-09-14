// Local storage utilities for data persistence

export const loadDataFromStorage = <T>(key: string, defaultData: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    // Log error in development mode
  }
  return defaultData;
};

export const saveDataToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    // Log error in development mode
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    // Log error in development mode
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // Log error in development mode
  }
};
