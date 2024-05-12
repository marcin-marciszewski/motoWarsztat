export const isMoreThan150Chars = (str: string) => str.length > 150;

export const saveLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};
