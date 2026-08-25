import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';

export const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search by name, mobile, ID...',
  onClear,
  debounceMs = 300,
  children,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange && localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs]);

  const handleClear = () => {
    setLocalValue('');
    if (onChange) onChange('');
    if (onClear) onClear();
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all shadow-sm"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Extra Filters (Children) */}
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
};

export default SearchBar;
