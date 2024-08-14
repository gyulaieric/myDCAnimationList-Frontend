const url = 'http://localhost:8080/list/';
const getAnimationUrl = 'http://localhost:8080/animations/';
const removeAnimationUrl = 'http://localhost:8080/list/';
const rateAnimationUrl = 'http://localhost:8080/list/rate/';
const shareListUrl = 'http://127.0.0.1:5500/list.html?userId=';

function getAnimations(url) {
    const request = new Request(url + localStorage.getItem('id'));

    fetch(request).then(response => response.json().then(list => {
        if (list.length == 0) {
            document.getElementById('container').classList.add('d-none');
            document.getElementById('emptyList').classList.remove('d-none');

            return;
        }

        list.forEach(listItem => {
            const getAnimationRequest = new Request(getAnimationUrl + listItem.animationId);
            fetch(getAnimationRequest).then(animation => animation.json().then(animation => {
                const tableBody = document.getElementById('tbody');

                const row = document.createElement('tr');
                tableBody.appendChild(row);
    
                row.appendChild(document.createElement('td')).innerHTML = '<h2>' + animation.id + '</h2>';
    
                const element = document.createElement('td');

                const div = document.createElement('div');
    
                div.className = 'row';
                div.innerHTML = '<div class="col-md-auto"><img src=' + animation.image_url +'></div>' +
                                    '<div class="col-md-auto"><h5>' + animation.title +'</h5><p>' + animation.year + '</p></div>';
    
                element.appendChild(div);

                row.appendChild(element);
                row.appendChild(document.createElement('td')).innerHTML = animation.rating;
                const userRating = document.createElement('td');

                const missingRating = document.createElement('p');
                missingRating.innerText = 'N/A ';
                userRating.appendChild(missingRating);
                
                const numberInput = document.createElement('input');
                numberInput.type = 'number';
                numberInput.min = 0;
                numberInput.max = 10;
                numberInput.placeholder = '0-10';
                numberInput.className = 'd-none';
                userRating.appendChild(numberInput);

                const rateButton = document.createElement('button');
                rateButton.className = 'btn btn-primary';
                rateButton.id = 'rateButton';
                rateButton.innerHTML = 'Rate';
                userRating.append(' ', rateButton);

                const errorMessage = document.createElement('p');
                errorMessage.className = 'd-none text-danger';
                userRating.appendChild(errorMessage);

                rateButton.addEventListener('click', event => {
                    event.preventDefault();
                    numberInput.classList.remove('d-none');
                    const submitButton = document.createElement('button');
                    submitButton.className = 'btn btn-primary';
                    submitButton.innerHTML = 'Submit';
                    userRating.replaceChild(submitButton, rateButton);

                    submitButton.addEventListener('click', event => {
                        event.preventDefault();

                        const requestBody = {
                            id: listItem.id,
                            userId: localStorage.id,
                            animationId: animation.id,
                            userRating: numberInput.value
                        }

                        const request = new Request(rateAnimationUrl + listItem.id, {
                            method: 'PUT',
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(requestBody)
                        })

                        fetch(request)
                        .then(response => response.json())
                        .then(response => {
                            if (response.error) {
                                errorMessage.innerText = response.message;
                                errorMessage.classList.remove('d-none');
                            } else {
                                window.location.reload();
                            }
                        });

                    })
                })

                if (listItem.userRating != null) {
                    numberInput.value = listItem.userRating;
                    numberInput.classList.remove('d-none');
                    rateButton.innerText = 'Change Rating';
                    missingRating.classList.add('d-none');
                }
                
                row.appendChild(userRating);

                const button = document.createElement('td');
                button.innerHTML = '<button class="btn btn-danger" id="removeButton">Remove</button>';
                row.appendChild(button);
                button.addEventListener('click', event => {
                    event.preventDefault();
                    removeFromlist(animation.id);
                    window.location.reload();
                });
            }));
        });
    }));
}

const shareButton = document.getElementById('shareButton');

function removeFromlist(animationId) {
    const request = new Request(removeAnimationUrl + animationId, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    fetch(request);
}

window.addEventListener('load', getAnimations(url));
shareButton.addEventListener('click', event => {
    const shareUrl = document.getElementById('shareUrl');
    shareUrl.value = shareListUrl + localStorage.getItem('id');
    shareUrl.classList.remove('d-none');
    shareUrl.focus();
    shareUrl.select();
});