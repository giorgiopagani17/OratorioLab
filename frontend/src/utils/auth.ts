import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useDetailsStore } from 'src/stores/details';
import axios from 'axios';

const router = useRouter();

export async function getValidAccessToken() {
  const authStore = useAuthStore();
  const detailtsStore = useDetailsStore();

  const accessToken = authStore.accessToken;
  const refreshToken = authStore.refreshToken;

  const isTokenValid = (token: string | null): boolean => {
    if(!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    return Date.now() <= expirationTime;
  }

  if(isTokenValid(accessToken)) {
    return accessToken;
  }

  if(refreshToken) {
    try {
      const response = await axios.post('http://localhost:3000/auth/refresh', {
        refresh_token: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      if (response.status === 200) {
        const data = response.data;
        const newAccessToken = data.access_token;
        const newRefreshToken = data.refresh_token;

        authStore.setAccessToken(newAccessToken);
        if (newRefreshToken) {
          authStore.setRefreshToken(newRefreshToken);
        }
      }
    } catch(error: unknown) {
      console.error('Error refreshing token:', error);
      authStore.logout();
      detailtsStore.clearDetails();
      router.push('/');
    }
  }
}
