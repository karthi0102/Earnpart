const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelector(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNum =num;

nextBtns.forEach((btn) => {
btn.addEventListener("click", () => {
  formStepsNum++;
  updateProgressbar();
});
});
function updateProgressbar() {
progressSteps.forEach((progressStep, idx) => {
  if (idx < formStepsNum + 1) {
    progressStep.classList.add("progress-step-active");
  } else {
    progressStep.classList.remove("progress-step-active");
  }
});

const progressActive = document.querySelectorAll(".progress-step-active");

progress.style.width =
  ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
}