<template>
  <div class="q-pa-md address-container">
    <div class="flex items-center">
      <div style="width: 80%">
        <q-input
          filled
          v-model="address"
          label="Enter your address"
          @update:model-value="onInput"
          @blur="() => { suggestions = [] }"
          color="secondary"
          clearable
          :loading="loading"
          debounce="300"
        >
          <template v-slot:append>
            <q-icon name="place" />
          </template>
        </q-input>

        <q-list
          v-if="suggestions.length"
          class="suggestions-list"
        >
          <q-item
            v-for="(suggestion, index) in suggestions"
            :key="index"
            clickable
            @click="selectSuggestion(suggestion)"
          >
            <q-item-section>{{ suggestion.display_name }}</q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="q-pl-md" style="width: 20%">
        <q-input
          filled
          v-model="civicNumber"
          label="Civic number"
          color="secondary"
          clearable
          debounce="300"
        >
          <template v-slot:append>
            <q-icon name="pin" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="flex items-center justify-between q-mt-md">
      <div id="map" style="height: 282px; width: 80%; border-radius: 12px" v-if="selectedLocation"></div>

      <div class="selected-location q-mt-md q-pl-md" v-if="selectedLocation" style="width: 20%">
        <div class="text-subtitle1 text-weight-bold text-primary">Selected Location:</div>
        <div class="text-body2 q-mt-xs">{{ selectedAddress }}</div>
        <div class="text-caption text-grey">
          Lat: {{ selectedLocation.lat.toFixed(6) }} <br/>
          Lon: {{ selectedLocation.lon.toFixed(6) }}
        </div>

        <div class="text-subtitle1 text-weight-bold text-primary q-mt-md">Civic Number:</div>
        <div class="text-body2 q-mt-xs">{{ civicNumber || 'Nessuno' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default {
  name: 'AddressInput',
  data() {
    return {
      address: '',
      civicNumber: '',
      suggestions: [],
      loading: false,
      map: null,
      marker: null,
      selectedAddress: '',
      selectedLocation: {
        lat: 45.756655699999996,
        lon: 9.754219200862249
      }
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
    validateInputs() {
      const hasErrors = !this.selectedLocation || !this.civicNumber;
      window.dispatchEvent(new CustomEvent('inputErrors', {
        detail: { hasErrors }
      }));
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
    async getAddressFromCoordinates() {
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            lat: this.selectedLocation.lat,
            lon: this.selectedLocation.lon,
            format: 'json'
          },
        });

        const address = response.data.address;
        // Check for various possible street name fields
        const street = address.road || address.street || address.pedestrian || address.footway || '';
        // Check for various possible municipality/city name fields
        const municipality = address.municipality || address.city || address.town || address.village || '';

        // Combine street and municipality if both exist
        if (street && municipality) {
          this.selectedAddress = `${street}, ${municipality}`;
        } else if (street) {
          this.selectedAddress = street;
        } else if (municipality) {
          this.selectedAddress = municipality;
        } else {
          this.selectedAddress = 'Location details not available';
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        this.selectedAddress = 'Address not found';
      }
    },
    selectSuggestion(suggestion) {
      this.address = suggestion.display_name;
      this.selectedLocation = {
        lat: parseFloat(suggestion.lat),
        lon: parseFloat(suggestion.lon)
      };
      this.suggestions = [];
      this.$nextTick(() => {
        this.initMap();
      });
    },
    initMap() {
      if (!this.map) {
        this.map = L.map('map');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
      }

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      this.map.setView([this.selectedLocation.lat, this.selectedLocation.lon], 16);
      this.marker = L.marker([this.selectedLocation.lat, this.selectedLocation.lon]).addTo(this.map);
      this.getAddressFromCoordinates();
    }
  },
  watch: {
    selectedLocation: {
      handler() {
        this.validateInputs();
      },
      deep: true
    },
    civicNumber: {
      handler() {
        this.validateInputs();
      }
    }
  },
  mounted() {
    this.$nextTick(async () => {
      this.initMap();
      await this.getAddressFromCoordinates();
      this.address = this.selectedAddress;
    });
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  }
};
</script>

<style scoped>
.address-container {
  position: relative;
}

.suggestions-list {
  position: absolute;
  z-index: 10000;
  width: calc(80% - 2rem);
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 4px;
  margin-top: 4px;
}
</style>
