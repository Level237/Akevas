export function safeJSONParse(value: any, fallback: any = null) {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === "undefined" ||
      value === "null"
    ) {
      return fallback;
    }
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }