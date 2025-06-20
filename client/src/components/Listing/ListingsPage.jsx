import React, { useEffect, useState } from "react";
import Header from "../sections/Header";
import ListingCard from "./ListingCard";
import LoadingSkeleton from "./LoadingSkeleton";
import styles from "./ListingsPage.module.css";

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    location: ""
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/listing`);
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        setListings(data);
        setFilteredListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter listings based on search and filters
  useEffect(() => {
    let filtered = listings;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(listing =>
        listing.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(listing => listing.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(listing => listing.price <= parseInt(filters.maxPrice));
    }

    setFilteredListings(filtered);
  }, [listings, searchQuery, filters]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      minPrice: "",
      maxPrice: "",
      location: ""
    });
  };

  if (error) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.error}>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Find Your Perfect Stay</h1>
          <p className={styles.heroSubtitle}>
            Discover unique places to stay around the world
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className={styles.searchSection}>
        <div className={styles.searchContainer}>
          {/* Main Search Bar */}
          <div className={styles.searchBar}>
            <div className={styles.searchInput}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search destinations, properties..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchField}
              />
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className={styles.filterInput}
              />
            </div>
            <div className={styles.filterGroup}>
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className={styles.filterInput}
              />
            </div>
            <div className={styles.filterGroup}>
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className={styles.filterInput}
              />
            </div>
            <button onClick={clearFilters} className={styles.clearFilters}>
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className={styles.resultsSection}>
        <main className={styles.grid}>
          {loading ? (
            <LoadingSkeleton count={6} />
          ) : filteredListings.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No properties found</h3>
              <p>Try adjusting your search or filters</p>
              <button onClick={clearFilters} className={styles.resetBtn}>
                Reset Filters
              </button>
            </div>
          ) : (
            filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          )}
        </main>
      </section>
    </div>
  );
}

export default ListingsPage;
