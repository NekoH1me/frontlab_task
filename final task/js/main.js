var userData;

var listContainer;
var popupContainer;

var popupGender;
var popupImg;
var popupName;
var popupStreet;
var popupCity;
var popupState;
var popupEmail;
var popupPostcode;
var popupPhone;

var sel;

function onWindowLoad() {
    storeDomElements();
    addEventListeners();
    handleUserData();
}

function storeDomElements() {
    listContainer = document.getElementById('list');
    popupContainer = document.getElementById('popup-container');

    popupGender = document.getElementById('gender');
    popupImg = document.getElementById('popup-image');
    popupName = document.getElementById('name');
    popupStreet= document.getElementById('street');
    popupCity = document.getElementById('city');
    popupState = document.getElementById('state');
    popupEmail = document.getElementById('email');
    popupPostcode = document.getElementById('postcode');
    popupPhone= document.getElementById('phone');

    sel = document.getElementById('sel');
}

function addEventListeners() {
    popupContainer.addEventListener('click', hidePopup);
    sel.addEventListener('change', onSortSel);
}

function handleUserData() {
    var url = 'https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture';

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function (jsonData) {
            userData = jsonData.results;
        })
        .then(markUsersWithIds)
        .then(createUserList)
        .catch(function(error) {
            console.log(error);
        });
}

function markUsersWithIds() {
    userData.forEach(function (user, index) {
        user.id = 'user_' + (index + 1).toString();
    });
}

function createUserList() {
    listContainer.innerHTML = '';

    userData.forEach(function (user) {
        var li = document.createElement('li');
        var img = document.createElement('img');
        var p = document.createElement('p');

        img.src = user.picture.medium;
        p.innerHTML = user.name.title + ' ' + user.name.first + ' ' + user.name.last;
        li.id = user.id;

        li.addEventListener('click', onUserClick);

        li.appendChild(img);
        li.appendChild(p);
        listContainer.appendChild(li);
    });
}

function onUserClick(event) {
    var tagName = event.target.tagName.toLowerCase();

    var li;
    if (tagName === 'img' || tagName === 'p') {
        li = event.target.parentElement;
    } else {
        li = event.target;
    }

    var id = li.id;

    showPopup(id);
}

function showPopup(id) {
    var foundUser;

    userData.forEach(function(user) {
        if (user.id === id) {
            foundUser = user;
        }
    });

    popupImg.src = foundUser.picture.large;
    popupGender.innerHTML = 'Gender: ' + foundUser.gender;
    popupName.innerHTML = 'Name: ' + foundUser.name.title + ' ' + foundUser.name.first + ' ' + foundUser.name.last;
    popupStreet.innerHTML = 'Street: ' + foundUser.location.street;
    popupCity.innerHTML = 'City: ' + foundUser.location.city;
    popupState.innerHTML = 'State: ' + foundUser.location.state;
    popupEmail.innerHTML = 'Email: ' + foundUser.email;
    popupPostcode.innerHTML = 'Postcode: ' + foundUser.location.postcode;
    popupPhone.innerHTML = 'Phone: ' + foundUser.phone;

    popupContainer.classList.add('visible');
}

function hidePopup() {
    popupContainer.classList.remove('visible');
}

function onSortSel() {
    if(sel.value == 1) {
        onSortAsc();
    } else if(sel.value == 2) {
        onSortDesc();
    } else if(sel.value == 3) {
        onSortReverse();
    } else return;
}

function onSortAsc() {
    sortUserData(true);
}

function onSortDesc() {
    sortUserData(false);
}

function onSortReverse() {
    userData.reverse();
    createUserList();
}

function sortUserData(asc) {
    if (!userData) {
        return;
    }

    userData.sort(function (firstUser, secondUser) {
        var firstSortItem = firstUser.name.first + firstUser.name.last;
        var secondSortItem = secondUser.name.first + secondUser.name.last;
        var tempItem;

        if (!asc) {
            tempItem = firstSortItem;
            firstSortItem = secondSortItem;
            secondSortItem = tempItem;
        }

        if (firstSortItem > secondSortItem) {
            return 1;
        } else if (firstSortItem < secondSortItem) {
            return -1;
        } else {
            return 0;
        }
    });

    createUserList();
}

window.onload = onWindowLoad;