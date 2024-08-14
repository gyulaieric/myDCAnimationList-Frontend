const url = 'http://localhost:8080/list/';
const getAnimationUrl = 'http://localhost:8080/animations/';
const getUsernameUrl = 'http://localhost:8080/user/';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userId = urlParams.get('userId');

function getAnimations() {
    const getUsernameRequest = new Request(getUsernameUrl + userId);

    const usernameDiv = document.getElementById('username');

    fetch(getUsernameRequest)
    .then(response => response.json()
    .then(response => {
        if (response.username) {
            usernameDiv.innerHTML = '<h2>' + response.username + "'s list</h2>";
        } else {
           usernameDiv.innerHTML = '<br><br><h2 class="text-danger text-center">' + response.error + '</h2>';
           document.getElementById('tableContainer').classList.add('d-none');
        }
    }));


    const request = new Request(url + userId);

    fetch(request).then(response => response.json().then(list => {
        if (list.length == 0) {
            document.getElementById('tableContainer').classList.add('d-none');
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
                userRating.innerHTML = 'N/A ';

                if (listItem.userRating != null) {
                    userRating.innerHTML = listItem.userRating;
                }
                
                row.appendChild(userRating);
            }));
        });
    }));
}

window.addEventListener('load', getAnimations);