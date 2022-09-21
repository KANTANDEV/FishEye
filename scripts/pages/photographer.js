//on recupere id du photographe dans l'url
const searchParams = new URLSearchParams(location.search)
const photographerId = +searchParams.get('id')
//on definit une oderBy pour le type de tri que l'on initailise a pop par defaut
let orderBy = 'pop'
//ont definie une variable pour stocker les infos du photographe
let photographer
//on definie une variable pour stocker les medias
let medias
//on definit un tableau vide pour les likes
const likes = []
	// on cree une fonction anonyme pour recuperer les infos du photographe
	; (async () => {
		try {
			//on attend une reponse de la requete fetch pour recuperer les infos du photographe
			const response = await fetch('./data/photographers.json')
			//on attend une reponse de la requete fetch pour recuperer les donnes en JSON
			const data = await response.json()
			//on affecte les infos du photographe a la variable photographer
			photographer = data.photographers.find((photographer) => photographer.id === photographerId)
			//on affecte les medias du photographe a la variable medias
			medias = data.media.filter((media) => media.photographerId === photographerId)
			//on calcule le nombre de ligne de medias a afficher et on definit la taille de la grille
			//gridTemplateRows definie le nombre de ligne de la grille
			//repeat on indique le nombre de ligne a afficher et la taille
			//math.ceil arrondi au nombre superieur
			//on divise le nombre de medias par 3 pour avoir le nombre de ligne a afficher
			photograph_medias.style.gridTemplateRows = 'repeat(' + Math.ceil(medias.length / 3) + ', 400px)'

			//on appelle la fonction orderMedias qui effectue un premier tri des medias
			orderMedias(photographer)
			//on appelle la fonction fillHeader qui affiche les infos du photographe
			fillHeader(photographer)
			//on appelle la fonction displayLikePrice qui affiche le nombre de likes et le tarifs journalier du photographe
			displayLikePrice(medias, photographer.price)
			//on cree un evement qui verifie que la modal est afficher
			addEventListener('keydown', (event) => {
				if (media_modal.style.display && media_modal.style.display !== 'none') {
					//on verifie que la touche left est appuyer
					if (event.code === 'ArrowLeft') {
						return changeMedia('left')
					}
					//on verifie que la touche right est appuyer
					if (event.code === 'ArrowRight') {
						return changeMedia('right')
					}
					if (event.code === 'Escape') {
						return closeMediaModal()
					}
				}
			})
			//Des que l'utilisateur modifie la vcaleur de trie des medias on appelle la fonction orderMedias qui retrie les medie en fonction de la nouvelle valeur de trie
			orderSelect.onchange = ({ target: { value } }) => orderMedias(photographer, value)
			//on va cherche rle titre qui se situe dans contact modal dans le DOM 
			const contactTitle = document.querySelector('#contact_modal h2')
			//on ajoute le nom du photographe au titre de la modal
			contactTitle.textContent += ' ' + photographer.name
			//on definie un erreur si le fetch ne fonctionne pas
		} catch (error) {
			console.error(error)
			const errorElement = document.createElement('h2')
			errorElement.classList.add('photographers_error')
			errorElement.textContent = 'Erreur lors de la récupération des données des photographes.'
			main.appendChild(errorElement)
		}
	})() //on appelle la fonction anonyme


function fillHeader(photographer) {
	//on cible les elenents du DOM qui contiennent les infos du photographe
	const { name, city, country, tagline, portrait } = photographer
	const nameElement = document.querySelector('.photograph_infos > h1')
	const locationElement = document.querySelector('.photograph_infos > p:nth-child(2)')
	const taglineElement = document.querySelector('.photograph_infos > p:last-child')
	const header = document.querySelector('.photograph-header')
	//on cree un element img pour afficher la photo de profil du photographe
	const image = document.createElement('img')
	//on ajouter les attributs a nos elements
	nameElement.textContent = name
	locationElement.textContent = city + ', ' + country
	taglineElement.textContent = tagline
	image.src = `./assets/photographers/${portrait}`
	image.alt = photographer.name
	//on ajoute l'element a son parent
	header.appendChild(image)
}

//on cree une fonction qui afiiche le nombre tottal de like et le tarifs journalier du photographe
function displayLikePrice(medias, price) {
	const element = document.querySelector('.photograph_likeprice')

	element.children[0].textContent = medias.reduce((sum, media) => sum + media.likes, 0) + ' ♥'
	element.children[1].textContent = price + '€ / jour'
}

//fonction qui trie les medias en fonction de la valeur de trie
function orderMedias(photographer, orderBy = 'pop') {
	switch (orderBy) {
		//trie par popularite
		case 'pop': {
			medias.sort((a, b) => b.likes - a.likes)
			break
		}
		//trie par date
		case 'date': {
			medias.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			break
		}
		//trie par titre
		case 'title': {
			medias.sort((a, b) => a.title.localeCompare(b.title))
			break
		}
	}
	//on appelle la fonction qui affiche les medias
	displayMedias(photographer, medias)
}

function displayMedias(photographer, medias) {
	//on cible l'element dan sle DOM
	const mediasSection = document.getElementById('photograph_medias')
	//on defie l'attribut de l'element
	mediasSection.innerHTML = ''

	for (const media of medias) {
		//on cree les elements qui vont contenir les medias
		const article = document.createElement('article')
		const mediaElement = media.video ? document.createElement('video') : document.createElement('img')
		const divInfos = document.createElement('div')
		const spanName = document.createElement('span')
		const spanLike = document.createElement('span')
		//on ajoute les attributs a nos elements
		article.dataset.id = media.id
		mediaElement.src = `./assets/images/${photographer.name}/${media.video ?? media.image}`
		mediaElement.alt = media.title
		mediaElement.controls = false
		mediaElement.autoplay = false

		spanName.textContent = media.title
		spanLike.textContent = media.likes + ' ♥'

		//on cree un evenement qui ecoute le click sur l'icone like et qui incremente le nombre de like
		spanLike.onclick = ({ target }) => {
			//Si dans le like il y a un media.id on sort de la de la fonction pour eviter de liker plusieurs fois le meme media
			if (likes.includes(media.id)) {
				return
			}
			//on cible l'element d enotre DOM qui contient le nombre de like
			const totalLikesElement = document.querySelector('.photograph_likeprice > span:first-child')
			//on convertie la string en number
			totalLikesElement.textContent = parseInt(totalLikesElement.textContent) + 1 + ' ♥'
			//on incremente le nombre de like du media
			target.textContent = parseInt(target.textContent) + 1 + ' ♥'
			//on ajoute le media.id dans le tableau likes
			likes.push(media.id)
		}
		//Quand on click sur la photo on la clone et on l'ajoute a la modal 
		//on va donc selectionner le dernier enfant de la modal qui est la div vide et lui copier la photo cloner 
		mediaElement.onclick = () => {
			media_modal.children[media_modal.children.length - 1].appendChild(mediaElement.cloneNode())
			media_modal.children[media_modal.children.length - 1].appendChild(spanName.cloneNode(true))
			//fait disparaite pour qu'il n'y est rien derriere la modal 
			media_modal.style.display = 'inherit'
			//on evite que la barre de defillement apparaisse
			document.body.style.overflow = 'hidden'
		}
		//on ajoute l'element a son parent
		article.appendChild(mediaElement)
		article.appendChild(divInfos)
		divInfos.appendChild(spanName)
		divInfos.appendChild(spanLike)
		mediasSection.appendChild(article)
	}
}

function changeMedia(direction) {
	//on clible l'element de contenu de la modal
	const media = media_modal.children[media_modal.children.length - 1].children[0]
	//on supprime le span qui contient le nom du media
	media_modal.children[media_modal.children.length - 1].children[1].remove()
	//on recupere le nom du fichier du media actuel
	const mediaSrc = media.src.split('/').pop() //on cree un tableau avec split qui va separer les elements du chemin du fichier et avec pop on recupere le dernier element du tableau qui est le nom du fichier
	const mediaIndex = medias.indexOf(medias.find((el) => (el.video ?? el.image) === mediaSrc))
	//on supprime le media
	media.remove()

	//on defini la nouvelle valeur de l'index en fonction de la direction
	let newIndex = 0

	if (direction === 'left') {
		newIndex = mediaIndex - 1
		if (newIndex < 0) {
			newIndex = medias.length - 1
		}
	} else if (direction === 'right') {
		newIndex = mediaIndex + 1
		if (newIndex >= medias.length) {
			newIndex = 0
		}
	}
	//on cree un nouvel element qui va contenir le nouveau media et qui verifie si c'est une video ou une image
	const mediaElement = medias[newIndex].video ? document.createElement('video') : document.createElement('img')
	//on ajoute les attributs a l'element
	const spanName = document.createElement('span')
	//on definit les contenus des elements
	mediaElement.src = `./assets/images/${photographer.name}/${medias[newIndex].video ?? medias[newIndex].image}`
	mediaElement.alt = medias[newIndex].title
	spanName.textContent = medias[newIndex].title

	media_modal.children[media_modal.children.length - 1].appendChild(mediaElement)
	media_modal.children[media_modal.children.length - 1].appendChild(spanName)
}

// supprime le contenu media ferme la modal 
function closeMediaModal() {
	media_modal.children[media_modal.children.length - 1].innerHTML = ''
	media_modal.style.display = 'none'
	document.body.style.overflow = 'auto'
}
