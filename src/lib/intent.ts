export function mkIntentBuilder<T>(pluginName: string) {
  return function <K extends keyof T>(type: K, payload: T[K]) {
    return {
      plugin: pluginName,
      action: type,
      data: payload,
    };
  };
}
