const hamMenu = document.querySelector(".ham-menu") as HTMLButtonElement;
const offScreenMenu = document.querySelector(".off-screen-menu") as HTMLButtonElement;

hamMenu.addEventListener("click", () => {
    hamMenu.classList.toggle("active");
    offScreenMenu.classList.toggle("active");
});