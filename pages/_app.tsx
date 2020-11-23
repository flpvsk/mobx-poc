import { Provider } from 'mobx-react';
import { useStore } from '../models/root-store';

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialState);

  return (
    <Provider value={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
