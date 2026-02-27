const API_BASE_URL = 'http://localhost:3001/api';

async function handleResponse(response) {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch (_) {}
    throw new Error(message);
  }
  return response.json();
}

export async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  return handleResponse(response);
}

export async function apiPost(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

export async function apiDelete(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

export async function apiPut(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}