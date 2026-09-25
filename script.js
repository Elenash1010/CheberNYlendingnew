const form = document.querySelector('#lead-form');
const phone = document.querySelector('#phone');
const bookingSection = document.querySelector('#booking');
const desktopBooking = window.matchMedia('(min-width: 1081px)');
document.querySelectorAll('.offers__booking, .venues__callback').forEach(link => {
  const updateBookingLink = () => {
    link.href = desktopBooking.matches ? '#booking' : 'tel:+73412664420';
  };
  updateBookingLink();
  desktopBooking.addEventListener('change', updateBookingLink);
  link.addEventListener('click', event => {
    if (!desktopBooking.matches) return;
    event.preventDefault();
    bookingSection.hidden = false;
    bookingSection.scrollIntoView({ behavior: 'auto', block: 'start' });
    form.elements.namedItem('name').focus({ preventScroll: true });
  });
});

function formatPhone(value){let digits=value.replace(/\D/g,'');if(!digits)return'';if(digits[0]==='8')digits='7'+digits.slice(1);if(digits[0]!=='7')digits='7'+digits;digits=digits.slice(0,11);const p=digits.slice(1);let out='+7';if(p.length)out+=' ('+p.slice(0,3);if(p.length>=3)out+=')';if(p.length>3)out+=' '+p.slice(3,6);if(p.length>6)out+='-'+p.slice(6,8);if(p.length>8)out+='-'+p.slice(8,10);return out}
phone.addEventListener('input',()=>{phone.value=formatPhone(phone.value)});
function setError(input,message){input.setAttribute('aria-invalid',message?'true':'false');const error=input.closest('.field').querySelector('.error');if(error)error.textContent=message}
const submitButton = form.querySelector('[type="submit"]');
const success = document.querySelector('#success');
const sendError = document.querySelector('#send-error');
let sending = false;
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (sending) return;
  success.hidden = true;
  sendError.hidden = true;
  const name = form.elements.namedItem('name');
  const guests = form.elements.namedItem('guests');
  phone.value = formatPhone(phone.value);
  let valid = true;
  [name, phone, guests].forEach(input => setError(input, ''));
  if (name.value.trim().length < 2) {
    setError(name, 'Укажите имя.');
    valid = false;
  }
  const digits = phone.value.replace(/\D/g, '');
  if (digits.length !== 11 || digits[0] !== '7') {
    setError(phone, 'Введите телефон в формате +7 (___) ___-__-__.');
    valid = false;
  }
  if (!guests.validity.valid) {
    setError(guests, 'Укажите целое количество гостей от 1 до 1000.');
    valid = false;
  }
  if (!valid) {
    event.preventDefault();
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }
  name.value = name.value.trim();
  const payload = {
    'Имя': name.value,
    'Телефон': phone.value,
    'Количество гостей': guests.value || 'Не указано',
    'Желаемая дата/время звонка': form.elements.namedItem('callback_time').value.trim() || 'Не указано',
    _subject: form.elements.namedItem('_subject').value,
    _template: form.elements.namedItem('_template').value
  };
  sending = true;
  submitButton.disabled = true;
  form.setAttribute('aria-busy', 'true');
  const buttonContent = submitButton.innerHTML;
  submitButton.textContent = 'Отправляем…';
  let timeout;
  try {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), 20000);
    const response = await fetch('https://formsubmit.co/ajax/lenochkash@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const result = await response.json();
    if (!response.ok || !(result.success === true || result.success === 'true')) {
      throw new Error('Submission failed');
    }
    success.hidden = false;
    // Keep the entered values available after submission.
    success.scrollIntoView({ behavior: 'auto', block: 'nearest' });
  } catch (error) {
    sendError.textContent = 'Не удалось подтвердить отправку. Проверьте соединение и попробуйте ещё раз. Введённые данные сохранены.';
    sendError.hidden = false;
    sendError.scrollIntoView({ behavior: 'auto', block: 'nearest' });
  } finally {
    clearTimeout(timeout);
    sending = false;
    submitButton.disabled = false;
    submitButton.innerHTML = buttonContent;
    form.removeAttribute('aria-busy');
  }
});
