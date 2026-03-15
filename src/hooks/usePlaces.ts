import { useState, useEffect } from 'react';
import { Place, DEFAULT_PLACES } from '../data/places';

const API_URL = 'http://localhost:3001/api/places';

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      
      // 1. Get from LocalStorage first (might have the user's unsaved links)
      const stored = localStorage.getItem('ucsc_places');
      let localData: Place[] = [];
      if (stored) {
        try {
          localData = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse local storage', e);
        }
      }

      // 2. Try to load from API
      const response = await fetch(API_URL).catch(() => null);
      
      if (response && response.ok) {
        const apiData = await response.json();
        
        // 3. MERGE LOGIC: If localStorage has more items than the API file, 
        // it means the user has unsaved changes. We should use those and push them to the API.
        if (localData.length > apiData.length && apiData.length <= DEFAULT_PLACES.length) {
          console.log('Local storage has more items than API. Migration required.');
          setPlaces(localData);
          // Auto-save local data to the API file
          savePlaces(localData);
        } else {
          setPlaces(apiData);
          localStorage.setItem('ucsc_places', JSON.stringify(apiData));
        }
      } else {
        // Fallback to localStorage if API is down
        console.warn('API not reachable, using localStorage');
        if (localData.length > 0) {
          setPlaces(localData);
        } else {
          setPlaces(DEFAULT_PLACES);
        }
      }
    } catch (error) {
      console.error('Error loading places:', error);
      setPlaces(DEFAULT_PLACES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ucsc_places' && e.newValue) {
        setPlaces(JSON.parse(e.newValue));
      }
    };

    const handleCustomChange = () => {
      loadPlaces();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('placesUpdated', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('placesUpdated', handleCustomChange);
    };
  }, []);

  const savePlaces = async (newPlaces: Place[]) => {
    try {
      setPlaces(newPlaces);
      localStorage.setItem('ucsc_places', JSON.stringify(newPlaces));
      
      console.log('Attempting to save to API...', API_URL);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlaces),
      }).catch((err) => {
        console.error('Fetch error:', err);
        return null;
      });

      if (response && response.ok) {
        console.log('Successfully saved to project folder (src/data/places.json)');
      } else {
        const errorMsg = response ? `Status: ${response.status}` : 'Server unreachable';
        console.warn('Could not save to project folder:', errorMsg);
        alert('Warning: Could not save to project folder. Changes are only in your browser. Make sure you ran "npm run dev" and the server is running on port 3001.');
      }
      
      window.dispatchEvent(new Event('placesUpdated'));
    } catch (error) {
      console.error('Failed to save places:', error);
      alert('Error saving data. See console for details.');
    }
  };

  const addPlace = (place: Omit<Place, 'id'>) => {
    const newPlace = { ...place, id: Date.now().toString() };
    savePlaces([...places, newPlace]);
  };

  const updatePlace = (id: string, updatedFields: Partial<Place>) => {
    const newPlaces = places.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    savePlaces(newPlaces);
  };

  const deletePlace = (id: string) => {
    savePlaces(places.filter(p => p.id !== id));
  };

  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all data to defaults? This will clear all custom links.')) {
      savePlaces(DEFAULT_PLACES);
    }
  };

  return {
    places,
    loading,
    addPlace,
    updatePlace,
    deletePlace,
    resetToDefault
  };
}
