import { useMemo } from 'react';
import { nanoid } from 'nanoid';
import {
  applySnapshot,
  Instance,
  SnapshotIn,
  SnapshotOut,
  getParent,
  flow,
  types,
  IArrayType,
  IAnyType,
} from 'mobx-state-tree';

import { Server } from './server';

let store: IStore | undefined;

const LocationInfo = types.model('LocationInfo', {
  id: types.identifier,
  lat: types.number,
  lng: types.number,
  postalCode: types.string,
  city: types.string,
});

type ILocationInfo = Instance<typeof LocationInfo>;

const Product = types.model({
  id: types.identifier,
  name: types.string,
  priceValue: types.number,
  currencyCode: types.string,
  currencySymbol: types.string,
});

type IProduct = Instance<typeof Product>;

const CartItem = types
  .model({
    product: types.reference(Product),
    quantity: types.number,
  })
  .actions((self) => ({
    setQuantity(q) {
      self.quantity = q;
    },
    remove() {
      getParent<IArrayType<IAnyType>>(self).remove(self);
    },
  }));

type ICartItem = Instance<typeof CartItem>;

const Cart = types.model({
  id: types.identifier,
  currentStep: types.number,
  locationInfo: types.maybe(types.reference(LocationInfo)),
  cartItems: types.array(CartItem),
});

type ICart = Instance<typeof Cart>;

const Store = types
  .model({
    cartMap: types.map(Cart),
    locationSuggestions: types.array(LocationInfo),
    lastFetchedProducts: types.optional(types.number, 0),
    isFetchingProducts: types.optional(types.boolean, false),
    productsAvailable: types.array(Product),
  })
  .actions((self) => {
    const fetchLocationSuggestions = flow(function* fetchSuggestions(
      s: string,
    ) {
      const locationInfoList = yield Server.fetchLocationSuggestions(
        s,
      );
      self.locationSuggestions = locationInfoList;
    });

    const startCart = (locationId: string) => {
      let location: ILocationInfo;
      for (let l of self.locationSuggestions) {
        if (l.id === locationId) {
          location = l;
        }
      }
      const cartId = nanoid();
      self.cartMap.put({
        id: cartId,
        locationInfo: location,
        currentStep: 0,
        cartItems: [],
      } as ICart);

      return cartId;
    };

    const fetchProducts = flow(function* fetchProductsFlow() {
      self.isFetchingProducts = true;
      const products = yield Server.fetchProducts();
      self.productsAvailable = products.map((p) => ({
        id: p.id,
        name: p.name,
        priceValue: p.price.value,
        currencyCode: p.price.currency.code,
        currencySymbol: p.price.currency.symbol,
      }));
      self.lastFetchedProducts = Date.now();
      self.isFetchingProducts = false;
    });

    return {
      fetchLocationSuggestions,
      startCheckout: startCart,
      fetchProducts,
    };
  });

export type IStore = Instance<typeof Store>;
export type IStoreSnapshotIn = SnapshotIn<typeof Store>;
export type IStoreSnapshotOut = SnapshotOut<typeof Store>;

export function initializeStore(snapshot = null) {
  const _store =
    store ??
    Store.create({
      cartMap: {},
      locationSuggestions: [],
    });

  // If your page has Next.js data fetching methods that use a Mobx store,
  // it will get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx`
  // for more details
  if (snapshot) {
    applySnapshot(_store, snapshot);
  }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return store;
}

export function useStore(): IStore {
  const store = useMemo<IStore>(() => initializeStore(null), []);
  return store;
}
