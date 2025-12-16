import 'chartjs-adapter-date-fns'
import bpk from 'url:./bpk.json'

let bpkData: Array<object> | undefined = undefined;

export async function getBpkData() {
  while (bpkData === undefined) {
    await new Promise((r) => setTimeout(r, 200));
  }
  return bpkData;
}

(async function () {
  const response = await fetch(bpk);
  const json = await response.json();
  bpkData = json.data;

  let html = document.getElementsByTagName("html")[0];

  let buttonIntroduction = document.getElementById("button-introduction");
  let buttonCloseIntroduction = document.getElementById("button-close-introduction");
  let dialogIntroduction = document.getElementById("dialog-introduction");

  buttonIntroduction?.addEventListener("click", (_) => {
    dialogIntroduction?.toggleAttribute("open");
    html.classList.toggle("modal-is-open");
  });

  buttonCloseIntroduction?.addEventListener("click", (_) => {
    dialogIntroduction?.toggleAttribute("open");
    html.classList.toggle("modal-is-open");
  });

  dialogIntroduction?.addEventListener("click", (e) => {
    if (e.target !== e.currentTarget) return;
    dialogIntroduction?.toggleAttribute("open");
    html.classList.toggle("modal-is-open");
  })

})();
