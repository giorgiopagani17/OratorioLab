import { defineStore } from 'pinia';

export const useDetailsStore = defineStore('details', {
  state: () => ({
    name: localStorage.getItem('name') || '',
    email: localStorage.getItem('email') || '',
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

      localStorage.removeItem('name');
      localStorage.removeItem('email');
    },

    setEmail(email: string) {
      this.email = email;
      localStorage.setItem('email', email);
    },
  },
});
