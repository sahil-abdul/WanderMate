let btn = document.querySelector("#flexSwitchCheckDefault");
let taxes = document.querySelectorAll(".tax");
let condition = "off";

btn.addEventListener("click", () => {
  for (const tax of taxes) {
    if (tax.style.display != "inline") {
      tax.style.display = "inline";
    } else {
      tax.style.display = "none";
    }
  }
});
