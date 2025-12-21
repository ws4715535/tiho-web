export const STORES = [
  { id: '127', name: '大学城', limit: 200 },
  { id: '30', name: '李家村', limit: 200 },
];

export const getStoreConfig = (arenaName: string) => {
  return STORES.find(store => store.name === arenaName) || STORES[0];
};
