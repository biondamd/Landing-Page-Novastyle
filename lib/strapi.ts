import qs from "qs";

type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | QueryValue[]
  | { [key: string]: QueryValue };

export type StrapiQuery = {
  populate?: QueryValue;
  sort?: QueryValue;
  filters?: QueryValue;
  fields?: QueryValue;
};

type StrapiRequestOptions = {
  query?: StrapiQuery;
  auth?: boolean;
};

export class StrapiHttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: unknown,
  ) {
    super(`Strapi request failed: ${status} ${statusText}`);
    this.name = "StrapiHttpError";
  }
}

export function getStrapiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");
}

function buildUrl(path: string, query?: StrapiQuery): string {
  const pathname = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(pathname, getStrapiBaseUrl());
  const queryString = query
    ? qs.stringify(query, {
        encodeValuesOnly: true,
        arrayFormat: "indices",
      })
    : "";

  if (queryString) url.search = queryString;
  return url.toString();
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

async function request<T>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  options: StrapiRequestOptions = {},
): Promise<T> {
  const headers = new Headers();
  const token = process.env.STRAPI_API_TOKEN;

  if (body !== undefined) headers.set("content-type", "application/json");
  if (options.auth !== false && token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, options.query), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new StrapiHttpError(response.status, response.statusText, payload);
  }

  return payload as T;
}

export function strapiGet<T>(path: string, options?: StrapiRequestOptions): Promise<T> {
  return request<T>("GET", path, undefined, options);
}

export function strapiPost<T>(
  path: string,
  body: unknown,
  options?: StrapiRequestOptions,
): Promise<T> {
  return request<T>("POST", path, body, options);
}

export function strapiMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${getStrapiBaseUrl()}${url.startsWith("/") ? url : `/${url}`}`;
}
