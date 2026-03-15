import { useState, useEffect } from 'react';
import { Place, DEFAULT_PLACES } from '../data/places';

const API_URL = 'http://localhost:3001/api/places';

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      // Try to load from API first
      const response = await fetch(API_URL).catch(() => null);
      
      if (response && response.ok) {
        const data = await response.json();
        setPlaces(data);
        // Sync to localStorage as backup
        localStorage.setItem('ucsc_places', JSON.stringify(data));
      } else {
        // Fallback to localStorage
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

    // Listen for changes from other tabs/components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ucsc_places') {
        const stored = localStorage.getItem('ucsc_places');
        if (stored) setPlaces(JSON.parse(stored));
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

  const savePlaces = async (newPlaces: Place[]) => {
    try {
      setPlaces(newPlaces);
      
      // Save to API (Project Folder)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlaces),
      }).catch(() => null);

      // Also save to localStorage for immediate UI feedback and backup
      localStorage.setItem('ucsc_places', JSON.stringify(newPlaces));
      
      if (response && response.ok) {
        console.log('Saved successfully to project folder');
      } else {
        console.warn('Could not save to project folder, saved to browser only');
      }
      
      window.dispatchEvent(new Event('placesUpdated'));
    } catch (error) {
      console.error('Failed to save places:', error);
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        alert('Storage limit reached! Local images are too large. Please use Google Drive links instead of uploading files.');
      } else {
        alert('Failed to save changes. Your changes are only saved in this browser.');
      }
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
    savePlaces(DEFAULT_PLACES);
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
