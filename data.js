function getDataInfo() {
    
    return {
        easy: {
            playerInfo: {
                hp: 5,
                exp: 0,
                exprequire: [0,10,28,60,90,999999]
            },
            gameInfo: {
                width: 14,
                height: 17,
                mineExp:[1,2,4,8,16,32,64,128,256],
                mineNum:  [20,14,8,4,2,0,0,0,0],
            }
        },
        normal: {
            playerInfo: {
                hp: 5,
                exp: 0,
                exprequire: [0,12,36,75,140,212,290,999999]
            },
            gameInfo: {
                width: 14,
                height: 17,
                mineExp:[1,2,4,8,16,32,64,128,256],
                mineNum:  [24, 18, 12, 8, 4, 2, 1, 0, 0],
            }
        },
        hard: {
            playerInfo: {
                hp: 10,
                exp: 0,
                exprequire: [0,20,50,150,300,540,860,1270,1890,999999]
            },
            gameInfo: {
                width: 14,
                height: 43,
                mineExp:[1,2,4,8,16,32,64,128,256],
                mineNum:  [40,28,22,18,14,12,8,5,2],
            }
        },
        lunatic: {
            playerInfo: {
                hp: 10000,
                exp: 0,
                exprequire: [0,20,50,150,300,550,934,1448,2088,999999]
            },
            gameInfo: {
                width: 14,
                height: 43,
                mineExp:[1,2,4,8,16,32,64,128,256],
                mineNum:  [40,28,22,18,14,12,8,5,2],
            }
        },
        extra: {
            playerInfo: {
                hp: 1,
                exp: 0,
                exprequire: [0,40,100,300,600,1100,1840,2896,4176,999999]
            },
            gameInfo: {
                width: 34,
                height: 34,
                mineExp:[1,2,4,8,16,32,64,128,256],
                mineNum:  [80,56,44,36,28,24,16,10,4],
            }
        }
    }
}
