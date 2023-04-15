document.addEventListener(
  "DOMContentLoaded",
  () => {
    document
      .querySelector('#backups')
      .addEventListener("click", ({ target }) => {
        if (target.matches('input[name="backup"]')) {
            console.log(target.id);
            [...document.querySelectorAll('.restore')].forEach(element => element.setAttribute('disabled', true))
            target.closest('tr').querySelector('.restore').removeAttribute('disabled')
        }
      });
  },
  false
);
