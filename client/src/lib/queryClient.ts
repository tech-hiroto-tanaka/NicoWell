import { QueryClient, QueryFunction } from "@tanstack/react-query";
import config from "./config";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// APIのベースURLを取得
function getApiUrl(path: string): string {
  const baseUrl = config.apiBaseUrl;
  // パスが既に完全なURLなら、そのまま返す
  if (path.startsWith('http')) return path;
  // ベースURLがあれば結合、なければ相対パスのまま
  return baseUrl ? `${baseUrl}${path}` : path;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // 完全なURLを生成
  const fullUrl = getApiUrl(url);
  console.log(`API Request to: ${fullUrl}`);
  
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    // credentialsモードを変更（CORSエラー回避）
    credentials: "omit",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // クエリキーから完全なURLを生成
    const fullUrl = getApiUrl(queryKey[0] as string);
    console.log(`Query Request to: ${fullUrl}`);
    
    const res = await fetch(fullUrl, {
      // credentialsモードを変更（CORSエラー回避）
      credentials: "omit",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
