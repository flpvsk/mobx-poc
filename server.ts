import { nanoid } from 'nanoid';

async function wait(sec) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

interface ILocationInfo {
  id: string;
  lat: number;
  lng: number;
  postalCode: string;
  city: string;
}

interface ICurrency {
  code: string;
  symbol: string;
}

export interface IPrice {
  value: number;
  currency: ICurrency;
}

interface IProduct {
  id: string;
  name: string;
  price: IPrice;
}

function randomString(n: number) {
  let s = '';
  while (n > 0) {
    n--;
    s += String.fromCharCode(65 + Math.round(Math.random() * 25));
  }

  return s;
}

export const Server = {
  async fetchLocationSuggestions(
    s: string,
  ): Promise<ILocationInfo[]> {
    const result = [];
    for (let i = 0; i < Math.random() * 10; i++) {
      result.push({
        id: nanoid(),
        lat: Math.random(),
        lng: Math.random(),
        postalCode: randomString(4),
        city: randomString(Math.random() * 10 + 4),
      });
    }
    return result;
  },

  async fetchProducts(): Promise<IProduct[]> {
    await wait(1);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    return [
      {
        id: '1',
        name: tomorrow.toDateString() + ', 12pm',
        price: {
          value: 10.0,
          currency: {
            code: 'eur',
            symbol: '€',
          },
        },
      },
      {
        id: '2',
        name: tomorrow.toDateString() + ', 1pm',
        price: {
          value: 20.0,
          currency: {
            code: 'eur',
            symbol: '€',
          },
        },
      },
      {
        id: '3',
        name: dayAfter.toDateString() + ', 12pm',
        price: {
          value: 22.0,
          currency: {
            code: 'eur',
            symbol: '€',
          },
        },
      },
    ];
  },
};
