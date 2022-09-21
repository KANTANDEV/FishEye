//fonction qui gere l'affichage de la modal
function displayModal() {
	const modal = document.getElementById('contact_modal')
	modal.style.display = 'inherit'
}
//fonction qui ferme la modal
function closeModal() {
	const modal = document.getElementById('contact_modal')
	modal.style.display = 'none'
}

function sendMessage(event) {
	//previens le comportement par defaut du formulaire
	event.preventDefault()
	//on recupere les valeurs des champs du formulaire
	for (const element of event.target.elements) {
		if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') {
			console.log(element.value)
			element.value = ''
		}
	}
	//on ferme la modal
	closeModal()
}
