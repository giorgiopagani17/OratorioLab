<template>
  <q-page class="q-pa-md">
    <q-input
      v-model="address"
      label="Enter your address"
      @update:model-value="onInput"
      filled
      clearable
      :loading="loading"
      debounce="300"
    >
      <template v-slot:append>
        <q-icon name="place" />
      </template>
    </q-input>

    <q-list v-if="suggestions.length" bordered>
      <q-item
        v-for="(suggestion, index) in suggestions"
        :key="index"
        clickable
        @click="selectSuggestion(suggestion)"
      >
        <q-item-section>{{ suggestion.display_name }}</q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddressInput',
  data() {
    return {
      address: '',
      suggestions: [],
      loading: false,
    };
  },
  methods: {
    onInput(value) {
      if (value.length > 2) {
        this.fetchSuggestions();
      } else {
        this.suggestions = [];
      }
    },
    async fetchSuggestions() {
      this.loading = true;
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: this.address,
            format: 'json',
            addressdetails: 1,
            limit: 5,
          },
          headers: {
            'User-Agent': 'YourAppName/1.0',
            'Accept-Language': 'en',
          },
        });
        this.suggestions = response.data;
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        this.suggestions = [];
      } finally {
        this.loading = false;
      }
    },
    selectSuggestion(suggestion) {
      this.address = suggestion.display_name;
      this.suggestions = [];
    },
  },
};
</script>v
