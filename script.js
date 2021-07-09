// Factory function qui crée les joueurs 
const Player = (name, sign) => {
    const getsign = () =>{
        return sign
    }
    const getname = () =>{
        return name;
    }
    return {getsign, getname};
}


// Module qui crée une array qui contient la table de jeux et renvoi un object avec des methodes pour pouvoir la modifier et y acceder
const GameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const reset = () => {
        for(let i=0; i<9; i++){
            board[i] = ""; 
        }
    }

    const getField = (index) =>{
        return board[index];
    }

    const setField = (index, sign) => {
        board[index] = sign;
    }
    return {reset, getField, setField};
})();


// Module qui contient les methodes pour gérer l'affichage
const DisplayControler = (() => {
        const cases = document.querySelectorAll("#cases");
        const showPlayer = (player) => {
            const playerField = document.getElementById("player")
            playerField.textContent = `${player.getname()} won !`;
        }
        const UptadeBoard = () => {
            for (let i=0;i<9; i++){
                cases[i].textContent = GameBoard.getField(i);
            }
        }
        return {cases, UptadeBoard, showPlayer};
})()

// Module qui déclanche les methodes de DisplayControler et contients des methodes qui controle le flow du jeux
const GameFlow = (() => {
    const playerX = Player("playerX", "X");
    const playerO = Player("playerO", "O");
    const restart = document.getElementById("restart");
    let whoPlay = playerX;


    // fonction qui vérifie si la table de jeux contient une combinaison gagnante
    const CheckWin = (number) => {
        const Combinaisions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ]
        // wayOfWining = Array qui contient toutes les combinaisons gagnante contenant le numéro de la case qui vient d'être cliquée
        const wayOfWining = Combinaisions.filter(row => row.includes(parseInt(number)));
        // double boucle qui check que pour au moins une des array,
        // quand on passe chaque element(numéro) en index de la board, il y a le même signe.
        // (dsl si c'est pas clair j'arrive pas a mieux l'expliquer en francais)
        for(let i = 0; i<wayOfWining.length; i++){
            let casesChecked = 0;
            for(let j = 0; j<wayOfWining[i].length; j++){
                if(GameBoard.getField(wayOfWining[i][j]) === whoPlay.getsign()){
                    casesChecked++;
                }
                if(casesChecked === 3){
                    return true;
                }
            }
            casesChecked = 0;
        }
        return false;
    }

    // Listener qui reset le jeux quand on clique sur le bouton restart
    restart.addEventListener("click", () => {
        GameBoard.reset();
        DisplayControler.UptadeBoard();
        whoPlay = playerX;
    })

    // Listener qui déroule la mecanique du jeux quand on clique sur une case 
    DisplayControler.cases.forEach(c => c.addEventListener("click", (e) => {
        if(GameBoard.getField(e.target.dataset.id) !== ""){
            return;
        }
        if(whoPlay === playerX){
        GameBoard.setField(e.target.dataset.id, playerX.getsign());
        DisplayControler.UptadeBoard();
        if(CheckWin(e.target.dataset.id)){
            GameBoard.reset();
            DisplayControler.showPlayer(whoPlay);
            DisplayControler.UptadeBoard();
            return
        };
        whoPlay = playerO;

        }
        else if(whoPlay === playerO){
        GameBoard.setField(e.target.dataset.id, playerO.getsign());
        DisplayControler.UptadeBoard();
        if(CheckWin(e.target.dataset.id)){
            GameBoard.reset();
            DisplayControler.UptadeBoard();
            DisplayControler.showPlayer(whoPlay);
            return
        };
        whoPlay = playerX;
        }
    }))
})();