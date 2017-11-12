
    var chess = document.getElementById("chess");
    var context=chess.getContext("2d");
    context.strokeStyle = "#bfbfbf";

    var win = [];
    var over = false;   //判断程序是否结束
    var count = 0;
    var myWin=[],computerWin=[];
    var me = true;
    var chessBoard=[];

    //初始化 chessBoard
    for(var i=0;i<15;i++){
        chessBoard[i]=[];
        for(var j=0;j<15;j++){
            chessBoard[i][j]=0;
        }
    }

    //初始化三维数组 win
    for(var i=0;i<15;i++){
        win[i]=[];
        for(var j=0;j<15;j++){
            win[i][j] = [];
        }
    }

    //赢法数组
    for(var i=0;i<15;i++){      //横
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                win[i][j+k][count] = true;
            }
            count++;
        }
    }
    for(var i=0;i<15;i++){      //竖
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                win[j+k][i][count] = true;
            }
            count++;
        }
    }
    for(var i=0;i<11;i++){      //斜
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                win[i+k][j+k][count] = true;
            }
            count++;
        }
    }
    for(var i=0;i<11;i++){  //反斜
        for(var j=14;j>3;j--){
            for(var k=0;k<5;k++){
                win[i+k][j-k][count] = true;
            }
            count++;
        }
    }
    console.log(count);

    //初始化myWin，computerWin
    for(var i=0;i<count;i++){
        myWin[i]=0;
        computerWin[i]=0;
    }

    console.log(myWin[1]);

    //画棋盘
    for(var i=0;i<15;i++){
        context.moveTo(15,15+30*i);
        context.lineTo(435,15+30*i);
        context.stroke();
        context.moveTo(15+30*i,15);
        context.lineTo(15+30*i,435);
        context.stroke();
    }
    //落子
    function oneStep(i,j,me) {
        context.beginPath();
        context.arc(15+30*i+2,15+30*j-2,13,0,2*Math.PI);
        context.closePath();
        var gra = context.createRadialGradient(15+30*i+2,15+30*j-2,10,15+30*i+2,15+30*j-2,0);
        if(me){
            gra.addColorStop(0,"#0a0a0a");
            gra.addColorStop(1,"#636766");
        }else{
            gra.addColorStop(0,"#d1d1d1");
            gra.addColorStop(1,"#f9f9f9")
        }
        context.fillStyle = gra;
        context.fill();
    }

    //我方下子
    chess.onclick = function(e){
        if(over || !me){
            return;
        }
        var i = Math.floor(e.offsetX/30);
        var j = Math.floor(e.offsetY/30);
        if(chessBoard[i][j] == 0){
            oneStep(i,j,me);
            chessBoard[i][j]=1;
             for(var k=0;k<count;k++){
                 if(win[i][j][k]){
                     myWin[k]++;
                     computerWin[k]=6;
                 }
                  if(myWin[k]==5){
                     alert("你赢了！");
                 }
                 if(myWin[k]==5){
                     over = true;
                 }
             }
        }
        if(!over){
            computerAi();
            me = !me;
        }
    }

    //计算机下子
    function computerAi(){
        var myScore = [];
        var computerScore = [];
        var max = 0; //最高分数
        var u = 0,v = 0; //最高分数的坐标

        //初始化数组 myScore computerScore
        for(var i=0;i<15;i++){
            myScore[i] = [];
            computerScore[i] = [];
            for(var j=0;j<15;j++){
                myScore[i][j] = 0;
                computerScore[i][j] = 0;
            }
        }

        for(var i=0;i<15;i++){
            for(var j=0;j<15;j++){
                if(chessBoard[i][j] == 0){
                    for(var k=0;k<count;k++){
                        if(win[i][j][k]){
                            if(myWin[k] == 1){
                                myScore[i][j] += 200;
                            }else if(myWin[k] == 2){
                                myScore[i][j] += 4000;
                            }else if(myWin[k] == 3){
                                myScore[i][j] += 60000;
                            }else if(myWin[k] == 4){
                                myScore[i][j] += 800000;
                            }else if(myWin[k] == 5){
                                myScore[i][j] += 1000000;
                            }
                            if(computerWin[k] == 1){
                                computerScore[i][j] += 220;
                            }else if(computerWin[k] == 2){
                                computerScore[i][j] += 4200;
                            }else if(computerWin[k] == 3){
                                computerScore[i][j] += 62000;
                            }else if(computerWin[k] == 4){
                                computerScore[i][j] += 820000;
                            }else if(computerWin[k] == 5){
                                computerScore[i][j] += 1020000;
                            }
                        }
                    }
                    if(myScore[i][j] > max){
                        max = myScore[i][j];
                        u = i;
                        v = j;
                    }else if(myScore[i][j] == max){
                        if(computerScore[i][j] > computerScore[u][v]){
                            u = i;
                            v = j;
                        }
                    }
                    if(computerScore[i][j] > max){
                        max = computerScore[i][j];
                        u = i;
                        v = j;
                    }else if(computerScore[i][j] == max){
                        if(myScore[i][j] > myScore[u][v]){
                            u = i;
                            v = j;
                        }
                    }
                }
            }
        }

        oneStep(u,v,false);
        chessBoard[u][v] =2;
        for(var k=0;k<count;k++){
            if(win[u][v][k]){
                computerWin[k]++;
                myWin[k]=6;
            }
            if(computerWin[k]==5){
                alert("计算机赢了！");
            }
            if(computerWin[k]==5){
                over = true;
            }
         }

        if(!over){
            me = !me;
        }
    }
