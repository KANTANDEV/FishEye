function photographerFactory(data) {
	//on destructurise l'objet data pour récupérer les données du photographe
	const { id, name, portrait, tagline, city, country, price } = data
	// on define le lien de l'image du photographe
	const picture = `./assets/photographers/${portrait}`

	function getUserCardDOM() {
		//on cree les elements dans le DOM
		const article = document.createElement('article')
		const link = document.createElement('a')
		const img = document.createElement('img')
		const h2 = document.createElement('h2')
		const div = document.createElement('div')
		const locationInfos = document.createElement('p')
		const taglineInfos = document.createElement('p')
		const priceInfos = document.createElement('p')
		//on definit les attributs des l'elements
		link.href = './photographer.html?id=' + id
		link.ariaLabel = name
		img.setAttribute('src', picture)
		img.alt = 'Photo du profil de ' + name
		h2.textContent = name
		//on ajoute l'element a son parent
		article.appendChild(link)
		link.appendChild(img)
		link.appendChild(h2)
		div.appendChild(locationInfos)
		div.appendChild(taglineInfos)
		div.appendChild(priceInfos)
		article.appendChild(div)
		//on definit les contenus des elements
		locationInfos.textContent = city + ', ' + country
		taglineInfos.textContent = tagline
		priceInfos.textContent = price + '€/jour'
		//on retourne les elements
		return article
	}
	// on retourne la fonctions
	//Meme si retourner l'article et le recuperer dans la page index.js aurait été plus simple, on retourne la fonction pour pouvoir l'utiliser dans la page index.js
	return { getUserCardDOM }
}

