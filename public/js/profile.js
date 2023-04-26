const btnLogout = document.getElementById('btn_logout')

btnLogout.addEventListener('click', logout)

async function logout(event) {
  event.preventDefault()

  await fetch('/api/sessions/logout', { method: 'DELETE' })

  window.location.assign('/')
}