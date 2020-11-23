import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { Server } from '../../server';
import { LocationInfoModel, LocationInfo } from '../cart';

export const LocationStoreModel = types
  .model('LocationStore')
  .props({
    currentLocation: types.optional(LocationInfoModel, () => LocationInfoModel.create()),
    locationSuggestions: types.optional(types.array(LocationInfoModel), []),
  })
  .actions((self) => ({
    appendLocationSuggestions(value: LocationInfo[]) {
      self.locationSuggestions.replace([...self.locationSuggestions, ...value]);
    },
    setCurrentLocation(value) {
      self.currentLocation = value;
    },
  }))
  .actions((self) => ({
    async apiGetLocationSuggestions(searchTerm: string) {
      const locationInfoList = await Server.fetchLocationSuggestions(searchTerm);
      self.appendLocationSuggestions(locationInfoList);
    },
  }));

export interface LocationStore extends Instance<typeof LocationStoreModel> {}
export interface LocationStoreSnapshot extends SnapshotOut<typeof LocationStoreModel> {}
