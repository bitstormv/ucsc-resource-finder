import { useState, useEffect } from 'react';
import { Place, DEFAULT_PLACES } from '../data/places';

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const loadPlaces = () => {
      const stored = localStorage.getItem('ucsc_places');
      if (stored) {
        try {
          setPlaces(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse places from local storage', e);
          setPlaces(DEFAULT_PLACES);
        }
      } else {
        setPlaces(DEFAULT_PLACES);
        localStorage.setItem('ucsc_places', JSON.stringify(DEFAULT_PLACES));
      }
    };

    loadPlaces();

    // Listen for changes from other tabs/components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ucsc_places') {
        loadPlaces();
      }
    };

    // Custom event for same-window updates
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

  const savePlaces = (newPlaces: Place[]) => {
    setPlaces(newPlaces);
    localStorage.setItem('ucsc_places', JSON.stringify(newPlaces));
    window.dispatchEvent(new Event('placesUpdated'));
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
    savePlaces(DEFAULT_PLACES);
  };

  return {
    places,
    addPlace,
    updatePlace,
    deletePlace,
    resetToDefault
  };
}
