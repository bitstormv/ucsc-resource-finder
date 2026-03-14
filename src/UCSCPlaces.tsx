import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Building, Layers, Info, Navigation, Clock, Accessibility, Phone, X, Star } from 'lucide-react';
import { usePlaces } from './hooks/usePlaces';
import { Place } from './data/places';

const CATEGORIES = ['All', 'Lecture Hall', 'Lab', 'Office', 'Library', 'Canteen', 'Other'];

/**
 * Converts a Google Drive sharing link to a direct image URL
 */
const getDirectDriveUrl = (url: string | undefined) => {
  if (!url) return url;
  
  // Handle Google Drive links
  if (url.includes('drive.google.com')) {
    let fileId = '';
    
    // Look for anything between /d/ and the next / or ?
    const dPattern = /\/d\/([^\/\?]+)/;
    const dMatch = url.match(dPattern);
    
    if (dMatch && dMatch[1]) {
      fileId = dMatch[1];
    } else {
      // Pattern for ?id=FILE_ID
      const idPattern = /[?&]id=([^&]+)/;
      const idMatch = url.match(idPattern);
      if (idMatch && idMatch[1]) {
        fileId = idMatch[1];
      }
    }
    
    if (fileId) {
      // Return the thumbnail URL which is more reliable for direct embedding
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
  }
  
  return url;
};

export default function UCSCPlaces() {
  const { places } = usePlaces();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('ucsc_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
  }, []);

  const toggleFavorite = (e: React.MouseEvent, placeName: string) => {
    e.stopPropagation();
    let newFavorites;
    if (favorites.includes(placeName)) {
      newFavorites = favorites.filter(name => name !== placeName);
    } else {
      newFavorites = [...favorites, placeName];
    }
    setFavorites(newFavorites);
    localStorage.setItem('ucsc_favorites', JSON.stringify(newFavorites));
  };

  const filteredPlaces = places.filter(place => {
    const matchesSearch = 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || place.category === activeCategory;
    const matchesFavorites = !showFavoritesOnly || favorites.includes(place.name);

    return matchesSearch && matchesCategory && matchesFavorites;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
          UCSC <span className="text-blue-600 dark:text-blue-400">Place Finder</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors">
          Navigate the University of Colombo School of Computing with ease. Find lecture halls, labs, offices, and more.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for a place (e.g., S104, Library)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center md:justify-end items-center w-full md:w-auto">
          <select 
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all shadow-sm border ${
              showFavoritesOnly 
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' 
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Star className={`w-5 h-5 ${showFavoritesOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
            Favorites
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
      >
        <AnimatePresence mode="popLayout">
          {filteredPlaces.map((place) => {
            const isFavorite = favorites.includes(place.name);
            return (
              <motion.div
                key={place.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedPlace(place)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all relative group"
              >
                <button 
                  onClick={(e) => toggleFavorite(e, place.name)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10"
                >
                  <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-500 text-amber-500' : 'text-slate-400 dark:text-slate-500'}`} />
                </button>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 pr-10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {place.name}
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                    {place.category}
                  </span>
                  {place.building && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <Building className="w-3 h-3" /> {place.building}
                    </span>
                  )}
                  {place.floor && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <Layers className="w-3 h-3" /> {place.floor}
                    </span>
                  )}
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                  {place.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Navigation className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                    <span className="line-clamp-2">{place.directions}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredPlaces.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
            <Search className="text-slate-400 dark:text-slate-500 w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No places found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search term or category filter.</p>
        </div>
      )}

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedPlace && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlace(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <button 
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto p-6 sm:p-8">
                <div className="mb-6 pr-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    {selectedPlace.name}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                      {selectedPlace.category}
                    </span>
                    {selectedPlace.building && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <Building className="w-4 h-4" /> {selectedPlace.building}
                      </span>
                    )}
                    {selectedPlace.floor && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <Layers className="w-4 h-4" /> {selectedPlace.floor}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 aspect-video relative">
                    <img 
                      src={getDirectDriveUrl(selectedPlace.imageUrl) || `https://placehold.co/600x400/f8fafc/475569?text=Photo+of+${encodeURIComponent(selectedPlace.name)}`} 
                      alt={selectedPlace.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/600x400/f8fafc/475569?text=Photo+Not+Found`;
                      }}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <span className="text-white text-sm font-medium">Location Photo</span>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 aspect-video relative">
                    <img 
                      src={getDirectDriveUrl(selectedPlace.floorPlanUrl) || `https://placehold.co/600x400/e2e8f0/0f172a?text=Floor+Plan:+${encodeURIComponent(selectedPlace.name)}`} 
                      alt="Floor Plan"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/600x400/e2e8f0/0f172a?text=Floor+Plan+Not+Found`;
                      }}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <span className="text-white text-sm font-medium">Floor Plan</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-500" /> Description
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {selectedPlace.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-emerald-500" /> How to get there
                    </h3>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-xl p-4">
                      <p className="text-emerald-800 dark:text-emerald-300">
                        {selectedPlace.directions}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                      <div>
                        <strong className="block text-sm text-slate-900 dark:text-white mb-0.5">Operating Hours</strong>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{selectedPlace.hours || "Mon-Fri: 8AM - 5PM"}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Accessibility className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                      <div>
                        <strong className="block text-sm text-slate-900 dark:text-white mb-0.5">Accessibility</strong>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{selectedPlace.accessibility || "Standard campus accessibility"}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                      <div>
                        <strong className="block text-sm text-slate-900 dark:text-white mb-0.5">Contact</strong>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{selectedPlace.contact || "Not available"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
