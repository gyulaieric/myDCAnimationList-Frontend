fetch('navbar.html')
.then(res => res.text())
.then(text => {
    let oldelem = document.querySelector("script#replace_with_navbar");
    let newelem = document.createElement("div");
    newelem.innerHTML = text;
    oldelem.parentNode.replaceChild(newelem, oldelem);

    const account = document.getElementById('navbarDropdown');

    if (localStorage.getItem('isLoggedIn') == 'true') {
        account.innerHTML = localStorage.getItem('username');
        const loginButton = document.getElementById('loginPage');
        const signupButton = document.getElementById('signupPage');
        const myListButton = document.getElementById('myList');
        const divider = document.getElementById('divider');
        const signoutButton = document.getElementById('signOut');

        signoutButton.addEventListener('click', event => {
            event.preventDefault();
            signOut();
        });

        loginButton.classList.add('d-none');
        signupButton.classList.add('d-none');

        myListButton.classList.remove('d-none');
        divider.classList.remove('d-none')
        signoutButton.classList.remove('d-none');
    }
});

function signOut() {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('jwt');

    window.location.replace('index.html');
}