//constants

const HEARTS = '\u2665';
const DIAMONDS = '\u2665'
const SPADES ='\u2660'
const CLUBS ='\u2663'

const BACKSIDE = 'backside'

// Set up the deck:
let deck = getDeck(); //returns a list of [rank, suit] lists
var dealerHand = [deck.pop(), deck.pop()];
var playerHand = [deck.pop(), deck.pop()];
let showDealerHand = false;

let money = 5000;
let bet = 0;
// updateDOM();

// Event Listeners:
const hitButtonElement = document.getElementById('hit-button');
const standButtonElement = document.getElementById('stand-button');
const doubleButtonElement = document.getElementById('double-button');
const submitBetElement = document.getElementById('submit-bet-button')
const betAmountElement = document.getElementById('bet-field');

const HIT = 'hit';
const PLACE_BET = 'place_bet';
const STAND = 'stand';
const DOUBLE = 'double';

//'Place Bet' button
submitBetElement.addEventListener('click',(e)=>{
    // e.preventDefault();
    bet = parseInt(betAmountElement.value)
    dispatchAction(PLACE_BET);
    betAmountElement.value = '';
    betAmountElement.style.backgroundColor = 'red';
    betAmountElement.placeholder = 'bet placed';
    submitBetElement.style.display = 'none';
    
})
//Pressing enter on keyboard
betAmountElement.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter') {
        submitBetElement.click();
    }
})

//Hit event
hitButtonElement.addEventListener('click', (e)=>{
    e.preventDefault();
    dispatchAction(HIT);
})

//Stand event
standButtonElement.addEventListener('click', (e)=>{
    e.preventDefault();
    dispatchAction(STAND);
})

//Double down event
doubleButtonElement.addEventListener('click', (e)=>{
    e.preventDefault();
    dispatchAction(DOUBLE);
    
})

function standAction(){
    showDealerHand = true;
    updateDOM();
    if (getHandValue(dealerHand) <=21) {
        while(getHandValue(dealerHand) < 17){
            alert('Dealer hits');
            dealerHand.push(deck.pop());
            updateDOM();
            if(getHandValue(dealerHand) > 21){
                break;
            }

        }
    }
    if (getHandValue(dealerHand)>21){
        alert('dealer busts! You won the bet!');
        money += bet;
    }
    else if (getHandValue(dealerHand) > getHandValue(playerHand)){
        alert('you lost');
        money -= bet; 

    }
    else if (getHandValue(dealerHand) < getHandValue(playerHand)){
        alert('you won');
        money += bet;
    }
    else if (getHandValue(dealerHand) == getHandValue(playerHand)){
        alert('well this is a tie. no money is won or lost')
    }

    bet = 0;
    resetBet();

    dealerHand = [deck.pop(), deck.pop()];
    playerHand = [deck.pop(), deck.pop()];
    showDealerHand = false;
}


function resetBet(){
    submitBetElement.style.display = 'inline';
    betAmountElement.placeholder = 'Enter bet amount';
    betAmountElement.style.backgroundColor = '';
    submitBetElement.value = 'Place Bet';
}
function dispatchAction(actionType) {
    //Check if the player has busted

    if(actionType == PLACE_BET && (money>=bet > 0)){ // if actionType is a number, then we interpret it as the bet amount.
        console.log(actionType);
    }
    else if(actionType == PLACE_BET){
        alert('Please enter a valid bet!')
        console.log(actionType)
    }

    if (actionType == HIT){
        playerHand.push(deck.pop());
        if(getHandValue(playerHand) > 21){
            updateDOM();
            alert('you busted!!!')
            dealerHand = [deck.pop(), deck.pop()];
            playerHand = [deck.pop(), deck.pop()];
            money -= bet;
            showDealerHand = false;
            bet = 0;
            resetBet();
        }

    

    }
    else if (actionType == STAND){
        standAction();
    }
    else if (actionType == DOUBLE){
        alert('double down!')
    }
    if (money <= 0) {
        alert('you lose! Game over.')
        location.reload();
    }
    updateDOM();
}


function getDeck() {
    let deck = [];
    let suits = [HEARTS, DIAMONDS, SPADES, CLUBS];
    let ranks = ['J', 'Q', 'K', 'A'];
    for(let suit=0; suit<suits.length; suit++){

        for(let rank = 2; rank < 11; rank++) {
            deck.push([rank.toString(), suits[suit]]);
        }
        for(let i=0; i<ranks.length; i++){
            deck.push([ranks[i], suits[suit]]);
        }
    }
    for(let i = deck.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}



function getHandValue(hand){
    let value = 0;
    let numberOfAces = 0;
    for(let i = 0; i < hand.length; i++){
        let rank = hand[i][0]
     
        if(rank=='A'){
            numberOfAces += 1;
        }
        else if(rank == 'K' ||rank == 'Q'||rank == 'J'){
            value += 10;
        }
        else{
            value += parseInt(rank)
        }
    }
    value += numberOfAces;
    for(let j = 0; j < numberOfAces; j++){
        if(value + 10 <= 21){
            value += 10;
        }
    }
    return value;
}


function updateDOM(){
    //Display Hands, money, and bet
    
    //Get a list of children nodes for Dealer
    let dealerHandElement = document.getElementById('dealer-hand');
    let playerHandElement = document.getElementById('player-hand');
    dealerHandElement.innerHTML = '';
    playerHandElement.innerHTML = '';
    let dealerChildren = [];
    for (let i = 0; i < dealerHand.length; i++){

        const card = document.createElement('div');
        
        if (i == 0 && !showDealerHand) {
            card.classList.add('backside')
            dealerChildren.push(card);
            continue;
        }

        let rank = dealerHand[i][0];
        let suit = dealerHand[i][1];
        card.innerHTML = rank + suit;
        console.log(rank + suit);
        // card.innerText += suit;
        console.log(rank)
        card.classList.add('card');
        dealerChildren.push(card);
    }

    //Get a list of children nodes for Player
    
    let playerChildren = []
    for (let i = 0; i < playerHand.length; i++){

        const card = document.createElement('div');

        let rank = playerHand[i][0];
        let suit = playerHand[i][1];
        card.innerText += rank;
        card.innerText += suit;
        card.classList.add('card');
        playerChildren.push(card);
    }

    //submit changes
    for(let i = 0; i < dealerChildren.length; i++){
        dealerHandElement.appendChild(dealerChildren[i]);
    }
    for(let i = 0; i < playerChildren.length; i++){
        playerHandElement.appendChild(playerChildren[i]);
    }
    document.getElementById('money-left').innerText = money;
    document.getElementById('bet-amount').innerText = bet;
    
    //update the running totals for player and dealer
    if (showDealerHand){
        document.getElementById('dealer-total').innerText = getHandValue(dealerHand);
    }
    else {
        document.getElementById('dealer-total').innerText = '???';
    } 
    document.getElementById('player-total').innerText = getHandValue(playerHand)
}