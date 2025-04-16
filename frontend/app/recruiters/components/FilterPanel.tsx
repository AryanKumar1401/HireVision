import React from "react";
import { EXPERIENCE_LEVELS, RATING_OPTIONS } from "../constants";
import { FilterOptions, FilterChangeHandler } from "../types";

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: FilterChangeHandler;
  totalResults: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  totalResults,
}) => {
  const handleExperienceLevelChange = (value: string) => {
    // Toggle experience level selection
    let newExperienceLevels: string[];
    if (value === "all") {
      // If "All Experience" is selected, clear all other selections
      newExperienceLevels = ["all"];
    } else {
      // Remove "all" if it's in the array and a specific experience level is selected
      const withoutAll = filters.experienceLevel.filter((exp) => exp !== "all");

      if (withoutAll.includes(value)) {
        // If already selected, remove it
        newExperienceLevels = withoutAll.filter((exp) => exp !== value);
        // If nothing is selected, default to "all"
        if (newExperienceLevels.length === 0) {
          newExperienceLevels = ["all"];
        }
      } else {
        // Add the new value
        newExperienceLevels = [...withoutAll, value];
      }
    }

    onFilterChange("experienceLevel", newExperienceLevels);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange("searchQuery", e.target.value);
  };

  const handleRatingChange = (value: number) => {
    onFilterChange("ratingMin", value);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    onFilterChange("dateRange", {
      ...filters.dateRange,
      start: newDate,
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    onFilterChange("dateRange", {
      ...filters.dateRange,
      end: newDate,
    });
  };

  const clearFilters = () => {
    onFilterChange("experienceLevel", ["all"]);
    onFilterChange("searchQuery", "");
    onFilterChange("ratingMin", 0);
    onFilterChange("dateRange", { start: null, end: null });
  };

  // Format date for HTML input
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            Filter Candidates
          </h3>
          <p className="text-gray-400 mt-1">
            {totalResults} candidate{totalResults !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          onClick={clearFilters}
          className="mt-3 md:mt-0 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-gray-700 text-white rounded-md pl-10 pr-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Name, skills, keywords..."
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Experience level filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Experience
          </label>
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => handleExperienceLevelChange(level.value)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.experienceLevel.includes(level.value)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rating
          </label>
          <div className="flex flex-wrap gap-2">
            {RATING_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleRatingChange(option.value)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.ratingMin === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date Applied
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="date"
                value={formatDateForInput(filters.dateRange.start)}
                onChange={handleStartDateChange}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="From"
              />
            </div>
            <div>
              <input
                type="date"
                value={formatDateForInput(filters.dateRange.end)}
                onChange={handleEndDateChange}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="To"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
