import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { Server } from '../../server';
import { CartModel, Cart } from '../cart';
import { ProductModel } from '../cart/product';

export const CartStoreModel = types
  .model('CartStore')
  .props({
    currentCart: types.optional(CartModel, () => CartModel.create()),
    productsAvailable: types.optional(types.array(ProductModel), []),
  })
  .actions((self) => ({
    appendProductsAvailable(value) {
      self.productsAvailable.replace([...self.productsAvailable, ...value]);
    },
    setCart(value: Cart) {
      self.currentCart = value;
    },
  }))
  .actions((self) => ({
    async apiGetProducts() {
      const products = await Server.fetchProducts();
      self.appendProductsAvailable(products);
    },
  }))
  .views((self) => ({
    get productsAvailableCount() {
      return self.productsAvailable.length;
    },
  }));

export interface CartStore extends Instance<typeof CartStoreModel> {}
export interface CartStoreSnapshot extends SnapshotOut<typeof CartStoreModel> {}
