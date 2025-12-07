
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<Response> {
  const sessionId = localStorage.getItem("admin_session");
  
  const headers: HeadersInit = {};
  
  if (sessionId) {
    headers.Authorization = `Bearer ${sessionId}`;
  }
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (response.status === 401) {
    localStorage.removeItem("admin_session");
    window.location.href = "/admin/login";
    throw new Error("Authentication required");
  }
  
  if (!response.ok) {
    const text = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${text}`);
  }
  
  return response;
}
