import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';

const Cart = observer(() => {
  const router = useRouter();
  const store = useStore();
  const { cartId, step } = router.query;

  if (
    !store.isFetchingProducts &&
    store.lastFetchedProducts < Date.now() - 60_000
  ) {
    store.fetchProducts();
  }

  let productsSection = null;
  if (store.isFetchingProducts) {
    productsSection = <div>Loading...</div>;
  }
  if (!store.isFetchingProducts) {
    productsSection = (
      <ul>
        {store.productsAvailable.map((p) => (
          <li key={p.id}>
            {p.name}, {p.priceValue}
            {p.currencySymbol}
          </li>
        ))}
      </ul>
    );
  }

  const cart = store.cartMap.get(cartId as string);

  useEffect(() => {
    if (!cart) {
      router.replace('/');
    }
  });

  let locationStr = '';
  if (cart) {
    const location = cart.locationInfo;
    locationStr = location.city + ', ' + location.postalCode;
  }

  return (
    <main>
      <h3>
        Cart <i>{cartId}</i>, step: {step || 1}
      </h3>
      <h4>Your location: {locationStr}</h4>
      <h4>Please choose the time slot</h4>
      {productsSection}
    </main>
  );
});

export default Cart;
