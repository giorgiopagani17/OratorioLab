import { getValidAccessToken } from './auth';

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    const token = await getValidAccessToken();
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    return await fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error('Error during API request:', error);
    throw error;
  }
}
