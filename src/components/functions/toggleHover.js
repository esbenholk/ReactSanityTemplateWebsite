export function toggleHover({ e }) {
  const thumbnail =
    e.target.parentNode.parentNode.getElementsByClassName("seeOnHover")[0];

  if (thumbnail !== undefined && thumbnail.classList.contains("hidden")) {
    thumbnail.classList.remove("hidden");
    thumbnail.classList.add("visible");
  } else if (
    thumbnail !== undefined &&
    thumbnail.classList.contains("visible")
  ) {
    thumbnail.classList.remove("visible");
    thumbnail.classList.add("hidden");
  }
}
