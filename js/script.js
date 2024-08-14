const url = 'http://localhost:8080/animations/';
const currentUserListUrl = 'http://localhost:8080/list/';
const addToListUrl = 'http://localhost:8080/list/';

function getAnimations(url) {
    const request = new Request(url);

    fetch(request).then((response) => response.json()).then((data) => {
        data.forEach(animation => {
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
            userRating.innerHTML = 'N/A';
            row.appendChild(userRating);

            if (localStorage.getItem('isLoggedIn') == 'true') {
                const request = new Request(currentUserListUrl + localStorage.getItem('id'));

                fetch(request)
                .then(response => response.json().then((list) => {
                    list.forEach(listItem => {
                        if (listItem.animationId == animation.id) {
                            const p = document.createElement('td');
                            p.innerHTML = '<p class="text-success">In your list</p>';
                            row.replaceChild(p, button);

                            if (listItem.userRating != null) {
                                userRating.innerHTML = listItem.userRating;
                            }
                        } 
                    })
                }));
            }

            const button = document.createElement('td');
            button.innerHTML = '<button class="btn btn-primary" id="addButton">Add to list</button>';
            row.appendChild(button);

            button.addEventListener('click', event => {
                addToList(animation.id);
                const p = document.createElement('td');
                p.innerHTML = '<p class="text-success">In your list</p>';
                row.replaceChild(p, button);
            });
        });
    })
}

function addToList(animationId) {
    if (localStorage.getItem('isLoggedIn') == 'false') {
        window.location.replace('login.html')
    } else {
        const request = new Request(addToListUrl + animationId, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        fetch(request)
        .then(respose => respose.json())
        .then(response => {
            if (response.error) {
                console.log(response.error);
            } else if (response.success) {
                console.log(response.success);
            }
        })
    }
}

window.addEventListener('load', getAnimations(url));