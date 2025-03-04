import { defineStore } from 'pinia';

export const useDetailsStore = defineStore('details', {
  state: () => ({
    name: localStorage.getItem('name') || '',
    email: localStorage.getItem('email') || '',
    leftDrawerOpen: localStorage.getItem('leftDrawerOpen') || '',
  }),
  actions: {
    setDetails(name: string, email: string) {
      this.name = name;
      this.email = email;

      localStorage.setItem('name', name);
      localStorage.setItem('email', email);
    },
    clearDetails() {
      this.name = '';
      this.email = '';
      this.leftDrawerOpen = '';

      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('leftDrawerOpen');
    },
    setEmail(email: string) {
      this.email = email;
      localStorage.setItem('email', email);
    },
    setLeftDrawerOpen(open: string) {
      this.leftDrawerOpen = open;
      localStorage.setItem('leftDrawerOpen', open);
    }
  },
});
