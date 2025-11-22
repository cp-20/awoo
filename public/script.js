document.addEventListener('htmx:wsAfterMessage', (e) => {
  const pops = [...document.querySelectorAll('.awoo-pop')];
  const lastAdded = pops.slice(-1)[0];
  if (!lastAdded) return;

  lastAdded.addEventListener('animationend', () => {
    lastAdded.remove();
  });
});
