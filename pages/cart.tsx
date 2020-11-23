import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { useStore } from '../models/root-store';

const Cart = observer(() => {
  const router = useRouter();
  const { cartStore } = useStore();
  const { apiGetProducts, currentCart, productsAvailable, productsAvailableCount } = cartStore;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      await apiGetProducts();
      setLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!currentCart) router.replace('/');
  }, [currentCart]);

  if (loading) return <div>loading...</div>;

  return (
    <main>
      <h3>
        There are {productsAvailableCount} available products and {currentCart.itemsCount} items in
        your cart.
      </h3>
      <h4>Your location: {currentCart.formattedLocation}</h4>
      <h4>Please choose the time slot</h4>
      <ul>
        {productsAvailable.map((p) => (
          <li key={`product-${p.id}`}>{p.formattedLabel}</li>
        ))}
      </ul>
    </main>
  );
});

export default Cart;
