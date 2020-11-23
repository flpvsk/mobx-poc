import { applySnapshot, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { createContext, useContext, useMemo } from 'react';
import { CartStoreModel } from '../cart-store';
import { LocationStoreModel } from '../location-store';

export const RootStoreModel = types.model('RootStore').props({
  cartStore: types.optional(CartStoreModel, () => CartStoreModel.create()),
  locationStore: types.optional(LocationStoreModel, () => LocationStoreModel.create()),
});

export interface RootStore extends Instance<typeof RootStoreModel> {}
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

const RootStoreContext = createContext<null | RootStore>(null);
export const RootStoreProvider = RootStoreContext.Provider;

let store: RootStore | undefined;

export function initializeStore(snapshot = null) {
  const _store = store ?? RootStoreModel.create({});

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.js` and `pages/ssr.js` for more details
  if (snapshot) {
    applySnapshot(_store, snapshot);
  }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return store;
}

export function useStore(initialState?: any) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
