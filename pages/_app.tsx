import { Provider } from 'mobx-react';
import { useStore } from '../store';

export default function App({ Component, pageProps }) {
  const store = useStore();

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
