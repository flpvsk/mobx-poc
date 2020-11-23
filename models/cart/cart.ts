import { Instance, types, SnapshotOut } from 'mobx-state-tree';
import { LocationInfoModel } from './location';
import { ProductModel } from './product';

const CartItem = types
  .model({
    product: types.optional(ProductModel, () => ProductModel.create()),
    quantity: types.number,
  })
  .actions((self) => ({
    setQuantity(value: number) {
      self.quantity = value;
    },
  }));

export const CartModel = types
  .model('Cart')
  .props({
    id: types.maybeNull(types.string),
    currentStep: types.maybeNull(types.number),
    locationInfo: types.optional(LocationInfoModel, () => LocationInfoModel.create()),
    cartItems: types.array(CartItem),
  })
  .views((self) => ({
    get formattedLocation() {
      return [self.locationInfo.city, self.locationInfo.postalCode].join(', ');
    },
    get itemsCount() {
      return self.cartItems.length;
    },
  }));

export interface Cart extends Instance<typeof CartModel> {}
export interface CartSnapshot extends SnapshotOut<typeof CartModel> {}
