export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const headers = new Headers(options.headers);
  const body =
    options.body === undefined
      ? undefined
      : typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body);

  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const endpoint = path.replace(/^\/+/, "");
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    headers,
    body,
    // Backend stores the JWT in an HttpOnly cookie, not in localStorage.
    credentials: options.credentials ?? "include",
  });

  if (!response.ok) {
    const responseText = await response.text();
    let message = responseText;
    try {
      const body = JSON.parse(responseText) as { message?: unknown };
      if (typeof body.message === "string") {
        message = body.message;
      }
    } catch {
      // The API may return a plain-text error body.
    }
    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event("student-management:unauthorized"));
    }
    throw new ApiError(
      message || `API request failed with status ${response.status}.`,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (response.status === 205 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
