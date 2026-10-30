const form = document.querySelector('#lead-form');
const phone = document.querySelector('#phone');

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
  sendError.textContent = 'Отправка заявок пока не подключена. Пожалуйста, свяжитесь с нами по телефону в шапке сайта.';
  sendError.hidden = false;
});

const booking = document.querySelector('#booking');
document.querySelectorAll('[data-open-booking]').forEach(button => {
  button.setAttribute('aria-controls', 'booking');
  button.addEventListener('click', () => {
    booking.showModal();
    document.body.classList.add('booking-open');
    document.querySelector('#name').focus({ preventScroll: true });
  });
});

booking.querySelector('.booking-modal__close').addEventListener('click', () => booking.close());
booking.addEventListener('click', event => {
  if (event.target !== booking) return;
  const bounds = booking.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) booking.close();
});
booking.addEventListener('close', () => document.body.classList.remove('booking-open'));
