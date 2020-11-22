import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useStore } from '../store';

const Home = observer(() => {
  const store = useStore();
  const router = useRouter();
  const [q, setQ] = useState('');

  function onSearchChange(e) {
    setQ(e.target.value);
  }

  function searchForSuggestions(e: React.FormEvent) {
    e.preventDefault();
    store.fetchLocationSuggestions(q);
  }

  function chooseLocation(location) {
    return (e) => {
      e.preventDefault();
      const cartId = store.startCheckout(location.id);
      router.push({
        pathname: '/cart/[cartId]',
        query: { cartId },
      });
    };
  }

  const locationList = store.locationSuggestions.map((location) => (
    <li key={location.id}>
      <a href={'#'} onClick={chooseLocation(location)}>
        {location.city}, {location.postalCode}
      </a>
    </li>
  ));

  return (
    <main>
      <h3>Search for an address</h3>
      <form onSubmit={searchForSuggestions}>
        <input type="text" value={q} onChange={onSearchChange} />
        <input type="submit" value="search" />
      </form>
      <ul>{locationList}</ul>
    </main>
  );
});

export default Home;
