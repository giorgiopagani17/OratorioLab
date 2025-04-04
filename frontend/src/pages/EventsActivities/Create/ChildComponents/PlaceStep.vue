<template>
  <div class="q-pa-md address-container q-my-auto">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <InputTextCustom
          :input-props="{
            filled: true,
          }"
          v-model="address"
          :label="$t('labels.insertAddress')"
          clearable
          :loading="loading"
          debounce="300"
          @update:model-value="onInput"
          :iconName="'place'"
          color="secondary"
        />

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

      <div class="col-12 col-md-4">
        <InputTextCustom
          :input-props="{
            filled: true,
          }"
          v-model="civicNumber"
          :label="$t('titles.civicNumber')"
          clearable
          debounce="300"
          :iconName="'pin'"
          color="secondary"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-md q-pb-md">
      <div class="col-12 col-md-8">
        <div id="map" class="map-container" v-if="selectedLocation"></div>
      </div>

      <div class="col-12 col-md-4 space-bottom-responsive" v-if="selectedLocation">
        <div class="selected-location">
          <div class="text-subtitle1 text-weight-bold text-primary">{{ $t('titles.selectedLocation') }}</div>
          <div class="text-body2 q-mt-xs">{{ selectedAddress }}</div>
          <div class="text-caption text-grey">
            Lat: {{ selectedLocation.lat.toFixed(6) }} <br/>
            Lon: {{ selectedLocation.lon.toFixed(6) }}
          </div>

          <div class="text-subtitle1 text-weight-bold text-primary q-mt-md">{{ $t('titles.civicNumber') }}</div>
          <div class="text-body2 q-mt-xs">{{ civicNumber || 'Nessuno' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {useEventsActivitiesStore} from '@/stores/eventsActivities';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import InputTextCustom from '@/components/Inputs/InputText.vue';

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
  components: {
    InputTextCustom
  },
  data() {
    return {
      store: useEventsActivitiesStore(),

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
      const hasErrors = !this.selectedLocation || !this.civicNumber.trim();
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

        const addr = response.data.address;
        this.selectedAddress = [
          addr.road,
          addr.house_number,
          addr.postcode,
          addr.city,
          addr.state,
          addr.country
        ].filter(Boolean).join(', ');
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
    },
    saveToLocalStorage() {
      const currentIndex = parseInt(this.store.eventsActivitiesIndex);
      const coordinates = [{
        latitude: this.selectedLocation.lat,
        longitude: this.selectedLocation.lon,
        civicNumber: this.civicNumber,
        address: this.selectedAddress
      }];
      if (this.store.eventsActivities[currentIndex]) {
        this.store.addCoordinates(currentIndex, coordinates);
      }
    },
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
    this.address = 'SP 36 Nembro-Selvino-Aviatico, 24027, Lombardia, Italia';
    window.addEventListener('saveAttributesStep', this.saveToLocalStorage);

    const currentIndex = parseInt(this.store.eventsActivitiesIndex);
    const savedEventActivity = this.store.eventsActivities[currentIndex];

    if (savedEventActivity?.place?.[0]) {
      this.selectedLocation = {
        lat: savedEventActivity.place[0].latitude,
        lon: savedEventActivity.place[0].longitude
      };
      this.civicNumber = savedEventActivity.place[0].civicNumber;
      this.address = savedEventActivity.place[0].address;
    }

    this.$nextTick( () => {
      this.initMap();
      this.getAddressFromCoordinates();
    });

    this.validateInputs();
  },
  beforeUnmount() {
    window.removeEventListener('saveAttributesStep', this.saveToLocalStorage);
    if (this.map) {
      this.map.remove();
    }
  }
};
</script>

<style lang="scss" scoped>
.address-container {
  position: relative;
}

.suggestions-list {
  position: absolute;
  z-index: 10000;
  width: calc(100% - 32px); // Adjust width to match only the address input
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 4px;
  margin-top: 4px;
}

.map-container {
  height: 309px;
  width: 100%;
  border-radius: 12px;
}

.selected-location {
  height: 100%;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(240, 240, 240, 0.5);
}

@media (max-width: 767px) {
  .map-container {
    height: 250px;
  }

  .space-bottom-responsive {
    margin-bottom: 10px;
  }

  .selected-location {
    margin-top: 12px;
  }
}
</style>
