import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useStore } from '../models/root-store';

const Home = observer(() => {
  const { locationStore } = useStore();
  const { apiGetLocationSuggestions, locationSuggestions, setCurrentLocation } = locationStore;

  const router = useRouter();
  const [q, setQ] = useState('');
  const [_, setLoading] = useState(false);

  function onSearchChange(e) {
    setQ(e.target.value);
  }

  async function searchForSuggestions(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await apiGetLocationSuggestions(q);
    setLoading(false);
  }

  function chooseLocation(location) {
    setCurrentLocation({ ...location });
    router.push({
      pathname: '/cart',
    });
  }

  return (
    <main>
      <h3>Search for an address</h3>
      <form onSubmit={searchForSuggestions}>
        <input type="text" value={q} onChange={onSearchChange} />
        <input type="submit" value="search" />
      </form>
      <ul>
        {locationSuggestions.map((location) => {
          return (
            <li key={location.id}>
              <div
                onClick={() => {
                  chooseLocation(location);
                }}
              >
                {location.formattedLocation}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
});

export default Home;
