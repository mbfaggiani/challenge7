const loginForm = document.getElementById('login_form')
const msgContainer = document.getElementById('message_container')

loginForm.addEventListener('submit', handleSubmit)

async function handleSubmit(e) {
  e.preventDefault()

  const data = Object.fromEntries(new FormData(e.target))

  await postData(data)
}

async function postData(data) {
  const URL = '/api/sessions/login'

  const sendForm = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const response = await sendForm.json()

  if (response.isLog) window.location.assign('/products')
  else msgContainer.innerText = response.message
}
