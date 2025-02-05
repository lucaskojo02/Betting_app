const title = document.querySelector(".title");
const symbolsGame = document.querySelector(".symbolsGame")
const spinResults = document.querySelector(".spinResults");
const container = document.querySelector(".container");
const depositInput = document.querySelector(".depositInput");
const depositButton = document.querySelector(".depositButton");
const depositWarning = document.querySelector(".depositWarning");
const placeBet = document.querySelector(".placeBet")
const spinInput = document.querySelector(".spinInput");
const spinButton = document.querySelector(".spinButton");
const withdrawInput = document.querySelector(".withdrawInput");
const withdrawButton = document.querySelector(".withdrawButton");
const balanceDisplay = document.querySelector(".balanceDisplay")
const depositMessage = document.querySelector(".depositMessage");
const exitButton = document.querySelector(".exitButton");
const startAgain = document.querySelector(".startAgain")
const exitGame = document.querySelector(".exitGame");
const exitYesButton = document.querySelector(".yes");
const exitNoButton = document.querySelector(".no");
const refreshGame = document.querySelector(".refreshGame");
const continueAction = document.querySelector(".continueAction");
const stopAction = document.querySelector(".stopAction");
const outcomeMessage = document.querySelector(".outcomeMessage");
const outcomeShow = document.querySelector(".outcomeShow");
const winOutcome = document.querySelector(".winOutcome");
const loseOutcome = document.querySelector(".loseOutcome");

const symbols = ["🍇","🍉","🔔","🍊","⭐"];
let balance = JSON.parse(localStorage.getItem('balance')) || 0.00;
if (balance > 1000){
    balanceDisplay.innerHTML = balance.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
}
else{
    balanceDisplay.innerHTML = balance.toFixed(2);
}

if (balance > 0){
    title.innerHTML = "SPIN GAME";
    symbolsGame.style.display = "block"
    spinResults.style.display = "block";
    depositWarning.style.display = "none";
    placeBet.style.display = "block";
}
else{
    title.innerHTML = "WELCOME TO SPIN GAME";
    symbolsGame.style.display = "none"
    spinResults.style.display = "none";
    depositWarning.style.display = "block";
    placeBet.style.display = "none";
}

let scores = JSON.parse(localStorage.getItem('scores'))||{
    win:0,
    lose:0
};
winOutcome.innerHTML = scores.win;
loseOutcome.innerHTML = scores.lose;

depositButton.addEventListener('click',depositAmount);
withdrawButton.addEventListener('click', withdrawAmount);
spinButton.addEventListener('click',spinRow);
exitButton.addEventListener('click',quitGame);
startAgain.addEventListener('click',startAgainGame);
depositInput.addEventListener('keydown',()=>{
    if (event.key === "Enter"){
        depositAmount();
    }
});
withdrawInput.addEventListener('keydown',()=>{
    if (event.key === "Enter"){
        withdrawAmount();
    }
});

spinInput.addEventListener('keydown',()=>{
    if (event.key === "Enter"){
        spinRow();
    }
});

function spinRow(){
    //let spinResult = [symbols[Math.floor(Math.random()*symbols.length)],symbols[Math.floor(Math.random()*symbols.length)],symbols[Math.floor(Math.random()*symbols.length)]];
    let winAmount = 0;

    const amount = spinInput.value;
    const spinAmount = document.createElement("p");
    const spinMessage = document.createElement("div");

    if (isNaN(amount) || amount <= 0){
        spinAmount.innerHTML = "Invalid amount!!";
        spinAmount.classList.add("spinAmount");
        container.append(spinMessage);
        spinMessage.classList.add("spinMessage")
        spinMessage.append(spinAmount);
    }
    else if (amount > balance){
        spinAmount.innerHTML = "Insufficient funds!!";
        container.append(spinMessage);
        spinMessage.classList.add("spinMessage");
        spinAmount.classList.add("spinAmount");
        spinMessage.append(spinAmount);
    }
    else{
        
        balance -= amount;
        updateBalance();
        document.querySelector(".spinSound").play();
        
        const slotElements = document.querySelectorAll(".slot");
        const resultDisplay = document.querySelector(".outcomeMessage");
    
        //spin Animation
        slotElements.forEach(slot =>{
            slot.classList.add("spinning");
            setTimeout(()=>slot.classList.remove("spinning"),300);
        });
        
        setTimeout(()=>{
            let spinResult = [symbols[Math.floor(Math.random()*symbols.length)],symbols[Math.floor(Math.random()*symbols.length)],symbols[Math.floor(Math.random()*symbols.length)]];
    
            slotElements.forEach((slot,index)=>{
                slot.textContent = spinResult[index];
               setTimeout(()=>{
                    slot.textContent = "";
                },3000)
            });
    
            if (spinResult[0] === spinResult[1] && spinResult[1] === spinResult[2]){
                if (spinResult[0] === "🍇"){
                    winAmount = amount*300;
                    balance += winAmount;
                    resultDisplay.innerHTML = `🎉CONGRATULATIONS +Ksh.${winAmount}🎉`;
                    resultDisplay.style.color = "purple";
                    document.querySelector(".winSound").play();
                    scores.win++;
                }
                else if (spinResult[0] === "🍉"){
                    winAmount = amount*400;
                    balance += winAmount;
                    resultDisplay.innerHTML = `🎉CONGRATULATIONS +Ksh.${winAmount}🎉`;
                    resultDisplay.style.color = "tomato";
                    document.querySelector(".winSound").play();
                    scores.win++;
                }
                else if (spinResult[0] === "🍊"){
                    winAmount = amount*500;
                    balance += winAmount;
                    resultDisplay.innerHTML = `🎉CONGRATULATIONS +Ksh.${winAmount}🎉`;
                    resultDisplay.style.color = "orange";
                    document.querySelector(".winSound").play();
                    scores.win++;
                }
                else if (spinResult[0] === "🔔"){
                    winAmount = amount*1000;
                    balance += winAmount;
                    resultDisplay.innerHTML = `🎊CONGRATULATIONS +Ksh.${winAmount}🎊`;
                    resultDisplay.style.color = "greenyellow";
                    document.querySelector(".bonusSound").play();
                    scores.win++;
                }
                else{
                    winAmount = amount*2000;
                    balance+=winAmount;
                    resultDisplay.innerHTML = `⭐JACKPOT! +Ksh.${winAmount}⭐`;
                    resultDisplay.classList.add("outcomeMessage")
                    resultDisplay.style.color = "gold";
                    document.querySelector(".jackpotSound").play();
                    scores.win++;
                }
                winOutcome.innerHTML = scores.win;
            }
            else{
                resultDisplay.innerHTML = "Sorry you lost 😭";
                resultDisplay.style.color = "red";
                document.querySelector(".loseSound").play();
                scores.lose+=1;
                loseOutcome.innerHTML = scores.lose;
            }
            updateBalance();
            localStorage.setItem('scores',JSON.stringify(scores));


            setTimeout(()=>{
                resultDisplay.innerHTML = "";
            },3000)
        },500);

    }
    setTimeout(()=>{
        spinMessage.style.display = "none"
    },1000);
    spinInput.value = "";
}



function depositAmount(){
    let amount = depositInput.value;
    const depositMessage = document.createElement("div");
    const amountCrement = document.createElement("p");
    const Balance = document.createElement("p");

    if(isNaN(amount) || amount <= 0){
        container.append(depositMessage);
        depositMessage.classList.add("depositMessage");
        amountCrement.classList.add("amountCrement");
        amountCrement.innerHTML = "Invalid amount!!";
        depositMessage.append(amountCrement);
    }
    else{
        amount = Number(amount)
        balance += amount;
        updateBalance();
        title.innerHTML = "SPIN GAME";
        symbolsGame.style.display = "block"
        spinResults.style.display = "block";
        depositWarning.style.display = "none";
        placeBet.style.display = "block";
        document.querySelector(".notification").play();

        amountCrement.classList.add("amountCrement");
        Balance.classList.add("Balance");

        amountCrement.innerHTML =`Deposit of Ksh: ${Number(amount).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})} was successfull`;
        Balance.innerHTML = `Your new balance is Ksh: ${Number(balance).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
        container.append(depositMessage);
        depositMessage.classList.add("depositMessage");
        depositMessage.append(Balance);
        depositMessage.prepend(amountCrement)
    }
    depositInput.value = "";
    setTimeout(()=>{
        depositMessage.style.display = "none";
    },1000);
}

function withdrawAmount(){
    let amount = withdrawInput.value;
    const withdrawalMessage = document.createElement("div");
    const amountCrement = document.createElement("p");
    const Balance = document.createElement("p");
    withdrawalMessage.style.display = "none";

    if(isNaN(amount) || amount <= 0){
        amountCrement.innerHTML = "Invalid withdrawal amount";
        container.append(withdrawalMessage);
        withdrawalMessage.classList.add("withdrawalMessage")
        amountCrement.classList.add("amountCrement");
        withdrawalMessage.append(amountCrement);
        withdrawalMessage.style.display = "block";
    }
    else if(amount > balance){
        amountCrement.innerHTML = "Insufficient funds";
        Balance.innerHTML = `Your balance is Ksh.${Number(balance).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
        updateBalance();
        container.append(withdrawalMessage);
        withdrawalMessage.classList.add("withdrawalMessage")
        amountCrement.classList.add("amountCrement");
        Balance.classList.add("Balance");
        withdrawalMessage.append(Balance);
        withdrawalMessage.prepend(amountCrement);
        withdrawalMessage.style.display = "block";
    }
    else{
        amount = Number(amount);
        balance -=amount;
        document.querySelector(".notification1").play();
        amountCrement.innerHTML = `Withdrawal of Ksh.${amount.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})} was successfull`;
        Balance.innerHTML = `Your new balance is Ksh.${balance.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
        updateBalance();
        container.append(withdrawalMessage);
        withdrawalMessage.classList.add("withdrawalMessage");
        amountCrement.classList.add("amountCrement");
        Balance.classList.add("Balance");
        withdrawalMessage.append(Balance);
        withdrawalMessage.prepend(amountCrement);
        balanceDisplay.innerHTML = Number(balance).toFixed(2);
        withdrawalMessage.style.display = "block";

    }
    setTimeout(()=>{
        withdrawalMessage.style.display = "none";
    },1000)

    withdrawInput.value = "";
}

function updateBalance(){
    let formattedBalance = balance.toFixed(2);

    if (balance >= 1000){
        formattedBalance = balance.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})
    }
    localStorage.setItem('balance',JSON.stringify(balance));
    balanceDisplay.innerHTML = formattedBalance;
}

function quitGame(){
    exitGame.style.display = "block";
    exitYesButton.addEventListener('click',event=>{
        localStorage.removeItem('balance');
        exitGame.style.display = "none";
        localStorage.removeItem('scores');
        balance = 0;
        scores.win = 0;
        scores.lose = 0;
        loseOutcome.innerHTML = scores.lose;
        winOutcome.innerHTML = scores.win;
        balanceDisplay.innerHTML = balance;
        setTimeout(()=>{
            location.reload()
        },1000)
    });
    exitNoButton.addEventListener('click',()=>exitGame.style.display = "none"
    )
}

function startAgainGame(){
    refreshGame.style.display = "block";
    continueAction.addEventListener('click',()=>{
        localStorage.removeItem('scores');
        scores.win = 0;
        scores.lose = 0;
        refreshGame.style.display = "none";
        loseOutcome.innerHTML = scores.lose;
        winOutcome.innerHTML = scores.win;
    });
    stopAction.addEventListener('click',()=>{
        refreshGame.style.display = "none";
    })
}
