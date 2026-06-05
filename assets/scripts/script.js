
//Funcionalidade para alternar entre os temas claro, escuro e azul
const tema1 = document.getElementById("tema1");
const tema2 = document.getElementById("tema2");
const tema3 = document.getElementById("tema3");

tema1.addEventListener("click", () => {
  document.body.classList.remove("tema2", "tema3");
  document.body.classList.toggle("tema1");
});

tema2.addEventListener("click", () => {
  document.body.classList.remove("tema1", "tema3");
  document.body.classList.toggle("tema2");
});

tema3.addEventListener("click", () => {
  document.body.classList.remove("tema1", "tema2");
  document.body.classList.toggle("tema3");
});