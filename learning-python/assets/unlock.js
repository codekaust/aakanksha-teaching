'use strict';
const form = document.querySelector('form[data-answer]');
const status = document.getElementById('unlock-status');
const answer = document.getElementById('answer');
const content = document.getElementById('answer-content');
const password = document.getElementById('password');
const submit = form.querySelector('button');
const decode = text => Uint8Array.from(atob(text), char => char.charCodeAt(0));
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!window.crypto?.subtle) {
    status.textContent = 'Open this page on the HTTPS website to unlock the answer key.';
    return;
  }
  submit.disabled = true;
  status.textContent = 'Unlocking…';
  let payload;
  try {
    const response = await fetch(form.dataset.answer);
    if (!response.ok) throw new Error('Unavailable answer key');
    payload = await response.json();
  } catch {
    status.textContent = 'The answer key could not be loaded. Check your connection and try again.';
    submit.disabled = false;
    return;
  }
  try {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password.value.trim()), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: decode(payload.salt), iterations: payload.iterations, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: decode(payload.iv) }, key, decode(payload.ciphertext));
    // HTML is authenticated by AES-GCM and authored by the course maintainer.
    content.innerHTML = new TextDecoder().decode(plain);
    answer.hidden = false;
    form.hidden = true;
    password.value = '';
    status.textContent = 'Unlocked. Compare one step at a time with your notebook.';
    document.getElementById('answer-title').focus();
  } catch {
    status.textContent = 'That password did not unlock this program. Check the day and password with your teacher.';
    password.focus();
  } finally {
    submit.disabled = false;
  }
});
document.getElementById('lock-answer').addEventListener('click', () => {
  content.replaceChildren();
  answer.hidden = true;
  form.hidden = false;
  status.textContent = 'Answer key locked.';
  password.focus();
});
function printPage(mode) {
  document.body.dataset.print = mode;
  window.print();
}
document.getElementById('print-answer').addEventListener('click', () => printPage('answer'));
document.getElementById('print-exercise').addEventListener('click', () => printPage('exercise'));
window.addEventListener('afterprint', () => { delete document.body.dataset.print; });
