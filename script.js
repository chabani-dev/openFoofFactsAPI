console.log('ok !');

/*
il va falloir :
- récupérer le code barre entré dans le formulaire, ok
- construire proprement l'url qui va permettre de récupérer les informations sur le produit voulu auprès de l'API OpenFoodFacts, ok
- on utilise cette url avec la fonction fetch()
- sur la promesse récupérée, on va traiter les réponses successives...
- au final, on affichera les données récoltées dans notre document.
*/

//todo on sélectionne les éléments dont on va avoir besoin

let inputElement = document.querySelector('input');
let buttonElement = document.querySelector('button');
let titleElement = document.querySelector('h1');
let descriptionElement = document.querySelector('.description');
let imageElement = document.querySelector('img');
let nutriscoreElement = document.querySelector('h3');
let alertElement = document.querySelector('.alert');


//todo on place l'écouteur d'évènement sur le bouton qui va déclencher la recherche du produit et son affichage

buttonElement.addEventListener('click', displayProduct);

function displayProduct(e) {
    e.preventDefault();
    console.log('vous avez cliqué');
    //todo récupérer la valeur du 'input'
    let gencode = inputElement.value;

    //todo construire proprement l'url nécessaire avec cette valeur (https://world.openfoodfacts.org/api/v0/product/3033710084913.json)
    gencode = gencode.replace(' ', '');
    console.log(gencode);
    let url;
    url = `https://world.openfoodfacts.org/api/v0/product/${gencode}.json`

    //todo afficher cette url dans la console
    console.log(url);

    // on lance la fonction fetch avec l'url récupérée pour obtenir le produit voulu
    fetch(url)
    .then(response => {
        if(!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(product => showProduct(product))
    .catch(error => alertElement.textContent = `Impossible d\'afficher le produit : ${error}`);

}

function showProduct(product) {
    console.log(product);
    // 'product' est un objet avec 4 propriétés : code, product, status et status_verbose. On va afficher les informations de 'product à condition que la propriété de 'product' soit 'true', sinon on peut afficher un message dans la balise 'alerte'.
    if(!product.status) {

        //todo enlever les informations du produit précédent
        titleElement.textContent = '';
        while (descriptionElement.firstChild) {
            descriptionElement.removeChild(descriptionElement.firstChild);
        }
        imageElement.src = '';
        nutriscoreElement.textContent = '';
        //todo----------------------------------------------

        alertElement.textContent = 'code ou produit invalide';

    } else {
        // on enlève les informations du produit précédent
        while (descriptionElement.firstChild) {
            descriptionElement.removeChild(descriptionElement.firstChild);
        }
        // on prévient que le produit a été trouvé
        alertElement.textContent = 'produit trouvé';
        // on met le titre
        titleElement.textContent = product.product.product_name + ' - ' + product.product.quantity;

        // on précise la catégorie dans la balise 'description'
        let category = document.createElement('p');
        category.textContent = product.product.categories_old;
        descriptionElement.appendChild(category);

        // on précise l'utilisation dans 'description'
        let preparation = document.createElement('p');
        preparation.textContent = product.product.preparation;
        descriptionElement.appendChild(preparation);

        // on place l'url de l'image dans l'attribut de la balise 'image'
        imageElement.src = product.product.image_front_url;

        // on renseigne le nutriscore s'il existe, au cas où il n'existe pas de nutriscore, il faudra enlever celui du produit précédent
        product.product.nutriscore_grade ? nutriscoreElement.textContent = 'Nutriscore : ' + product.product.nutriscore_grade.toUpperCase() : nutriscoreElement.textContent = 'Pas de nutriscore';
    }
}

