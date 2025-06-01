let list = ["empty"];
let wordboxList = [];
for(let i=0;i<wordlist.length;i++){
    let container = document.createElement("span");
    let box = document.createElement("input");
    box.type="checkbox";
    box.class="wordbox";
    box.dataset.id=i;
    container.innerHTML=wordlist[i].split(',')[0].split(' ').map(a=>a.length).join(' ');
    box.dataId=container.innerHTML;
    container.append(box);
    wordboxContainer.append(container);
    wordboxList.push(box);
}
let updateWordList = () => {
    list = [];
    if(themes.value.length){
        list = themes.value.split(comma.checked ? "," : " ")
    }
    else{
        for(let box of wordboxList){
            if(box.checked){
                list.push(wordlist[box.dataset.id].split(','));
            }
        }
        list = list.flat();
    }
    if(!list.length){
        list = ["empty"];
    }
}
themes.addEventListener("input", updateWordList);
comma.addEventListener("input", updateWordList);
for(let box of wordboxList){
    box.addEventListener("input", updateWordList);
}
let selected = "";
let clue = "";
let listmode = false;
let listmodeAnswers = [];
let listmodeAccepted = [];
let updateClue = () => {
    theme.innerHTML=clue.split("").join("&nbsp;").replace(" ","\t");;
    if(listmode){
        listmodeAnswers=[];
        for(let i=0;i<list.length;i++){
            if(clue.length==list[i].length){
                let match = true;
                for(let j=0;j<clue.length;j++){
                    if(clue[j]!="_"&&clue[j]!=list[i][j]){
                        match=false;
                    }
                    if(clue[j]=="_"&&list[i][j]==" "){
                        match=false;
                    }
                }
                if(match){
                    listmodeAnswers.push(list[i]);
                }
            }
        }
        if(hideFraction.checked){
            fraction.innerHTML = "";
        }
        else{
            fraction.innerHTML = "0/" + listmodeAnswers.length;
        }
        accepted.innerHTML="";
        listmodeAccepted=[];
    }
    
}
let solve = (clue) => {
    console.log(clue);
    clue=clue.split('');
    let possible = wordlist.join(',').split(',').filter(a=>
        a.split('').every((a,i)=>
            (clue[i]=="_"&&a!=" ")||a==clue[i]
        )&&a.length==clue.length
    )
    accepted.innerHTML=possible.join(",");
}
let timer = 0;
let timerCount = 0;
let pause = true;
let startTimer = () => {
    pause = false;
    timer = performance.now();
    timerDisplay.innerText = "";
    timerCount = 0;
    setTimeout(tickTimer, 1000);
}
let tickTimer = () => {
    if(pause){
        return;
    }
    timerCount++;
    timerDisplay.innerText = timerCount;
    setTimeout(tickTimer, 1000);
}
let stopTimer = () => {
    pause = true;
    timeDiff = Math.round(performance.now() - timer)/1000;
    timerDisplay.innerText = timeDiff;
}
let revealed = 0;
random.onclick = () => {
    selected = list[Math.floor(Math.random() * list.length)];
    clue=selected.replace(/[^ ]/g, "_")
    listmode = listMode.checked;
    if(listmode){
        listmodeAccepted=""
    }
    else{
        accepted.innerText="";
        fraction.innerText="";
    }
    result.innerHTML = "";
    revealed = 0;
    updateClue();
    startTimer();
    reveal.disabled=false;

    if(instantReveal.value){
        let n = parseInt(instantReveal.value);
        for(let i=0;i<n;i++){
            reveal.click();
        }
    }
};
reveal.onclick = () => {
    let n = Math.floor(Math.random() * clue.split("").reduce((a,b)=>a+(b=="_"),0));
    for(let i=0;i<clue.length;i++){
        if(clue[i]=="_"){
            if(n==0){
                clue=clue.split("");
                clue[i]=selected[i];
                clue=clue.join("");
            }
            n--;
        }
    }
    revealed++;
    updateClue();
    startTimer();
}
revealRest.onclick = () => {
    accepted.innerHTML=listmodeAnswers.join(", ");
}
revealMissed.onclick = () => {
    accepted.innerHTML=listmodeAnswers.filter(a=>!listmodeAccepted.includes(a)).join(", ");
}
alloff.onclick = () => {
    for(let box of wordboxList) {
        box.checked = false;
    }
    updateWordList();
}
allon.onclick = () => {
    for(let box of wordboxList) {
        box.checked = true;
    }
    updateWordList();
}
multion.onclick = () => {
    for(let box of wordboxList) {
        if(box.dataId.split(" ").length>1){
            box.checked=true;
        }
        else{
            box.checked=false;
        }
    }
    updateWordList();
}
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if(guess.value==""){
        reveal.click();
    }
    if(guess.value=="r"){
        random.click();
    }
    if (solverMode.checked) {
        solve(guess.value);
    }
    else if (!listmode){
        if (guess.value == selected) {
            result.innerHTML = "you got it!";
            stopTimer();
        }else{
            result.innerHTML = "nope, try again :(";
        }
    }
    else{
        if(guess.value.split("").includes("_")){
            clue=guess.value;
            allon.click();
            updateClue();
            reveal.disabled=true;
        }
        else if(listmodeAnswers.includes(guess.value)&&!listmodeAccepted.includes(guess.value)){
            listmodeAccepted.push(guess.value);
            accepted.innerHTML=listmodeAccepted.join(", ");
            if(!hideFraction.checked){
                fraction.innerHTML = listmodeAccepted.length + "/" + listmodeAnswers.length;
            }
            if (listmodeAccepted.length == listmodeAnswers.length) {
                result.innerHTML = "you got em all!";
                stopTimer();
            }
        }
    }
    guess.value = "";
})
