window.addEventListener('load', init);

//Globals
let apiUrl = 'https://api.le-systeme-solaire.net/rest/bodies/';

function init()
{

    gallery = document.getElementById('body-gallery');

    ajaxCall(apiUrl, createList);
}

/**
 * Initialize after the DOM is ready
 */
function ajaxCall(url, successHandler){
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json()
        })
        .then(successHandler)
        .catch(ajaxErrorHandler);
}

function ajaxErrorHandler(data) {
    console.error(data);
    let error = document.createElement('div');
    error.innerHTML ='Er ging iets mis. Probeer het later nog een keer.';
    error.classList.add('error');
    gallery.appendChild(error);
}


function createList(data) {
    for (let body of data.bodies) {
        // Filter: alleen echte planeten
        if (body.bodyType === 'Planet'|| body.englishName === 'Moon' || body.bodyType === 'Star' ) {
            let div = document.createElement('div');
            div.classList.add('body-card');
            div.dataset.name = body.englishName;
            gallery.appendChild(div);

            let detailUrl = `${apiUrl}${body.id}`;
            div.dataset.url = detailUrl;
            console.log(detailUrl);
            ajaxCall(detailUrl, fillList);
        }
    }
}



function fillList(data){
    let body = document.querySelector(`.body-card[data-name="${data.englishName}"]`)

    let title = document.createElement('h2')
    let discoveredBy = document.createElement('p1')

    title.innerHTML = `${data.englishName}`;
    discoveredBy.innerHTML = data.discoveredBy === '' || data.discoveredBy == null ? 'unknown' : `${data.discoveredBy}`;

    body.appendChild(title);
    body.appendChild(discoveredBy);
}