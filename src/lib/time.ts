export const sleep = async (sec: number) => {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
};

export function now() {
  return Math.floor(Date.now() / 1000);
}
