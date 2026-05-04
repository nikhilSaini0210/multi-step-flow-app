import { StorageKeys } from "@/constants/storage";
import { ProgressSnapshot } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

let _sessionId: string | null = null;

export const initSessionId = async (): Promise<string> => {
  if (_sessionId) {
    return _sessionId;
  }

  try {
    const existing = await AsyncStorage.getItem(StorageKeys.SESSION_ID);

    if (existing) {
      _sessionId = existing;
      return existing;
    }

    const id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    await AsyncStorage.setItem(StorageKeys.SESSION_ID, id);
    _sessionId = id;
    return id;
  } catch (error) {
    _sessionId = `session_fallback_${Date.now()}`;
    return _sessionId;
  }
};

export const getSessionId = (): string => {
  return _sessionId ?? "session_unknown";
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn("[Storage] Failed to write key:", key);
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch {}
};

export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch {}
};

export const safeParse = (raw: string | null): ProgressSnapshot | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.currentStepIndex !== "number" ||
      !parsed.savedAt
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};
