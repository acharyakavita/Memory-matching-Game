/*
 *  list that holds all of 16 cards
 */
let cards = ['fa-gem', 'fa-paper-plane', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb',
    'fa-gem', 'fa-paper-plane', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];

/*
 *  list to hold the ids of 16 cards. This helps in unique identification.
 */
const ids = ['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8', 'card9', 'card10', 'card11', 'card12', 'card13',
    'card14', 'card15', 'card16']


/*
 *  All the arrays and variables
 */
let count = 0;
let selectedCards = [];
let classOfCardSelected = [];
let cardMatched = [];
let cardNo = [];
let moveCount = 0;
let timerStatus;
let starCount = 5;
let seconds = 0, minutes = 0, hours = 0;
let saveSeconds = 0, saveMinutes = 0, saveHours = 0;
let winFlag = false;
let win5stars = 0;
let win4stars = 0;

load();
restart();
help();


/*
 *  function to load the 16 cards on the screen
 */
function load() {
    let liCard = '';
    /*random 16 cards are shuffled and stored in cards array and corresponing html is created and displayed */
    cards = generate(cards);
    for (let card of cards) {
        const deck = document.querySelector('.deck');
        liCard = document.createElement('li');
        liCard.innerHTML += `<i class="fa ${card}"></i>`;
        deck.appendChild(liCard);
        liCard.classList.add('card');
    }

    /*ids for 16 cards are added */
    const liNum = document.querySelectorAll('.deck li');
    for (let i = 0, j = 0; i < ids.length, j < liNum.length; i++ , j++) {
        liNum[j].id = ids[i];
    }
    /*timer starts*/
    CalculateTimeElapsed();
    /*game starts*/
    gameStart();
};


// Shuffle function to generate  16 cards in random order
function generate(cards) {
    let currentIndex = cards.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
    return cards;
};


/*
*  function to load when cards are clicked. Event listeners are added on the card click.clickCard() function 
stores the clicked card if it not already clicked.Once we have 2 clicked cards checkMatch() is called to check if they match
*/
function gameStart() {
    let newCard = document.querySelectorAll('.card');
    for (let item of newCard) {
        item.addEventListener('click', function (event) {
            cardNo.push(event.target.id);
            clickCard(item);
            if (count === 2) {
                setTimeout(checkMatch, 1000);
                cardNo.length = 0;
            }

        })
        /*eventListener to avoid mouse double click*/
        item.addEventListener("dblclick", function (event) {
            event.preventDefault();
            event.stopPropagation();
        }
            , false);
    }

};


/*
 *  function to show the card clicked and save it for later comparison.
*/
function clickCard(item) {
    /*if same card is not clicked twice,continue*/
    if (cardNo[0] != cardNo[1]) {
        count = count + 1;
        incrementMoves();                   /*increment move counter*/
        item.classList.add('show', 'open');     /*show the selecected card*/
        selectedCards.push(item);               /*save it for comparision*/
        classOfCardSelected.push(event.target.childNodes.item(0).classList[1]);
    }
    else{
        cardNo.pop();
    }
}

/*
 *  function to increment the number of moves on screen.
*/
function incrementMoves() {
    moveCount = moveCount + 1;
    let moves = document.querySelector('.move-count');
    moves.innerHTML = moveCount;
    changeRating();                              /*change rating according to the moves*/
}


/*
 *  function to change Rating as per the number of moves.
*/
function changeRating() {
    const star = document.querySelectorAll('.stars li i');
    if (moveCount > 16 && moveCount <= 26) {
        if (starCount === 5) {
            star[4].classList.remove('fa');
            star[4].classList.add('far');
            starCount = starCount - 1;
        }
    }
    if (moveCount > 26 && moveCount <= 32) {
        if (starCount === 4) {
            star[3].classList.remove('fa');
            star[3].classList.add('far');
            starCount = starCount - 1;
        }
    }
    if (moveCount > 32 && moveCount <= 40) {
        if (starCount === 3) {
            star[2].classList.remove('fa');
            star[2].classList.add('far');
            starCount = starCount - 1;
        }
    }
    if (moveCount > 40) {
        if (starCount === 2) {
            star[1].classList.remove('fa');
            star[1].classList.add('far');
            starCount = starCount - 1;
        }
    }
}

/*
 *  function to check if the selected cards match or not.
*/

function checkMatch() {
    count = 0;
    if (classOfCardSelected[0] === classOfCardSelected[1]) {
        matchFound(classOfCardSelected);                  /*match found*/
    }
    else {
        matchNotFound();                                  /*match not found*/
    }
}

/*
 *  function to turn the matching cards green 
*/
function matchFound(classOfCardSelected) {

    for (let select of classOfCardSelected) {
        cardMatched.push(select);                        /*store matched cards*/
    }

    for (let cls of selectedCards) {
        cls.classList.add('match');                      /*display the card with green color*/
    }
    selectedCards.length = 0;
    classOfCardSelected.length = 0;
    setTimeout(checkGameStatus, 1000);                      /*check if you have won*/
}


/*
 *  function to turn the unmatching cards 
*/
function matchNotFound() {
    for (let cls of selectedCards) {
        cls.classList.add('unmatch');                     /*change the color to red*/
    }
    setTimeout(unselectCards, 1000);                      /*unselect them*/
}


/*
 *  function to turn the unmatched cards to their original state
*/
function unselectCards() {
    for (let cls of selectedCards) {
        cls.classList.remove('unmatch', 'show', 'open');
    }
    selectedCards.length = 0;
    classOfCardSelected.length = 0;
}

/*
 *  function to check if all 16 cards are matched and game is won
*/
function checkGameStatus() {
    if (cardMatched.length === 16) {
        winMessage();
    }
}


/*
 *  function to display the modal with Congratulations message and game statistics
*/
function winMessage() {
    winFlag = true;
    let body = document.querySelector('body');
    let modal = document.createElement('div');
    let time = document.querySelector('.timer');
    clearTimeout(timerStatus);
    modal.innerHTML +=`<div class="content"><h2>congratulations!!!You won!!!</h2>
                        <p>with ${moveCount} moves and ${starCount} stars in ${time.textContent} seconds</p>
                        <button class="new-game">New Game</button></div>`;
    body.appendChild(modal);
    modal.classList.add('modal');
    updateBoard();
    playAgain();
}

/*
 *  function to update the leader board.
*/
function updateBoard() {

    let star5 = document.querySelector('.stars5');
    let star4 = document.querySelector('.stars4');
    let bestTime = document.querySelector('.bestTime');
    /*to update the star count*/
    if (starCount === 5) {
        win5stars++;
        star5.textContent = win5stars;
    } 
    if (starCount === 4) {
        win4stars++;
        star4.textContent = win4stars;
    }
    /*to update the fastest time*/
    if (saveHours === 00 && saveMinutes === 00 && saveSeconds === 00) {
        saveHours = hours;
        saveMinutes = minutes;
        saveSeconds = seconds;
    } else {
        if (saveHours > hours) {
            saveHours = hours;
        }
        if (saveHours >= hours && saveMinutes > minutes) {
            saveMinutes = minutes;
        }
        if (saveHours >= hours && saveMinutes >= minutes && saveSeconds > seconds) {
            saveSeconds = seconds;
        }
    }
    bestTime.textContent = (saveHours ? (saveHours > 9 ? saveHours : "0" + saveHours) : "00") +
        ":" + (saveMinutes ? (saveMinutes > 9 ? saveMinutes : "0" + saveMinutes) : "00") +
        ":" + (saveSeconds > 9 ? saveSeconds : "0" + saveSeconds);
}

/*
 *  function to start a new game when the new-game button is clicked.
*/
function playAgain() {
    const newGame = document.querySelector('.new-game');
    newGame.addEventListener('click', function () {
        resetScreen();
        load();
    })

}

/*
 *  function to start a new game when the restart button is clicked.
*/
function restart() {
    const restart = document.querySelector('.restart');
    restart.addEventListener('click', function () {
        resetScreen();
        load();
    })

}

/*
 *  function to clear the existing screen when New game button is clicked.
*/
function resetScreen() {

    /*remove the modal displayed*/
    if (winFlag === true) {
        let body = document.querySelector('body');
        let item = body.lastElementChild;
        body.removeChild(item);
        winFlag = false;
    }

    /*remove the deck of cards*/
    let deckOfCards = document.querySelector('.deck');
    let card = deckOfCards.firstChild;

    while (card) {
        deckOfCards.removeChild(card);
        card = deckOfCards.firstChild;
    }

    /*reset the rating*/
    const stars = document.querySelectorAll('.stars li i');
    for (let star of stars) {
        star.classList.remove('far');
        star.classList.add('fa');
    }
    starCount = 5;

    /*reset the moves*/
    moveCount = 0;
    let moves = document.querySelector('.move-count');
    moves.innerHTML = moveCount;

    /*reset the timer*/
    clearTimeout(timerStatus);
    seconds = 0;
    minutes = 0;
    hours = 0;
    let time = document.querySelector('.timer');
    time.textContent = "00:00:00";

    /*initialize all the variables and array*/
    selectedCards.length = 0;
    classOfCardSelected.length = 0;
    cardMatched.length = 0;
    count = 0;

}


/*
 * function to execute the timer
 */


function CalculateTimeElapsed() {
    timerStatus = setTimeout(addTime, 1000);
}

/*
 * function to calculate the time
 */
function addTime() {
    let time = document.querySelector('.timer')
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    time.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") +
        ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
        ":" + (seconds > 9 ? seconds : "0" + seconds);

    CalculateTimeElapsed();
}

/*
 * function to display "how to play" message.
 */
function help() {

    let help = document.querySelector('.help');
    let helpModal = document.querySelector('.help-modal');
    let close = document.querySelector('.close');

    help.addEventListener('click', function () {
        helpModal.classList.add('help-modal', 'show');
    })

    close.addEventListener('click', function () {
        helpModal.classList.remove('show');
    })
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == helpModal) {
            helpModal.classList.remove('show');
        }
    }
}
