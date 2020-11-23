import { Instance, types, SnapshotOut } from 'mobx-state-tree';

export const LocationInfoModel = types
  .model('LocationInfo', {
    id: types.maybeNull(types.string),
    lat: types.maybeNull(types.number),
    lng: types.maybeNull(types.number),
    postalCode: types.maybeNull(types.string),
    city: types.maybeNull(types.string),
  })
  .views((self) => ({
    get formattedLocation() {
      return [self.city, self.postalCode].join(', ');
    },
  }));

export interface LocationInfo extends Instance<typeof LocationInfoModel> {}
export interface LocationInfoSnapshot extends SnapshotOut<typeof LocationInfoModel> {}
