import { Instance, SnapshotOut, types } from 'mobx-state-tree';

const CurrencyModel = types.model('Currency').props({
  code: types.optional(types.string, 'eur'),
  symbol: types.optional(types.string, '€'),
});

const PriceModel = types.model('Price').props({
  value: types.maybeNull(types.number),
  currency: types.optional(CurrencyModel, () => CurrencyModel.create()),
});

export const ProductModel = types
  .model('Product')
  .props({
    id: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    price: types.optional(PriceModel, () => PriceModel.create()),
  })
  .views((self) => ({
    get formattedLabel() {
      return [self.name, self.price.value, self.price.currency.symbol].join(', ');
    },
  }));

export interface Product extends Instance<typeof ProductModel> {}
export interface ProductSnapshot extends SnapshotOut<typeof ProductModel> {}
