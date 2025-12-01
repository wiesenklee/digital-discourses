import bpk from 'url:./bpk.json'

let bpkData: Array<object> | undefined = undefined;

(async function () {
  const response = await fetch(bpk);
  const json = await response.json();
  bpkData = json.data;
})();

export async function getBpkData() {
  while (bpkData === undefined) {
    await new Promise((r) => setTimeout(r, 200));
  }
  return bpkData;
}
