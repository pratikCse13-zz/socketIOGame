var app = angular.module('game', []);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

app.controller('gameController',['$scope', '$http', '$document', function($scope, $http, $document){
    var socket = io();
    $scope.gaming = false;
    $scope.playing = false;
    $scope.roomList = [];
    $scope.room = {};
    $scope.newRoomName = '';
    $scope.newRoomPassword = '';
    $scope.joinRoomPassword = '';
    $scope.joinRoomError = false;
    $scope.joinRoomErrorMsg = '';
    $scope.createRoomError = false;
    $scope.createRoomErrorMsg = '';
    $scope.startGameError = false;
    $scope.startgameErrorMsg = '';
    $scope.update = '';
    $scope.creator = false;
    $scope.timerId = '';

    $scope.ctx = $document[0].getElementById("map").getContext("2d");
    $scope.ctx.font = '30px Arial';
    $scope.tank = $document[0].getElementById("tank");
    $scope.ctx.drawImage(tank,  34, 43);

    socket.on('newFrame', function(frame){
        $scope.ctx.fillText('dasdada', 500,500);
        console.log('new frame')
        console.log(frame.players[0])
        $scope.ctx.clearRect(0, 0, 1000, 500);
        frame.players.forEach(function(player){
            console.log(frame.players.length)
            console.log('writing : '+ player.number+ ' at '+player.x+ ' and '+player.y);
            $scope.ctx.fillText(player.number,player.x,player.y);
        });

        console.log(frame.bullets)
        frame.bullets.forEach(function(bullet){
            console.log(bullet)
            $scope.ctx.fillText('o', bullet.x, bullet.y);
        });

        console.log(frame.barriers)
        frame.barriers.forEach(function(barrier){
            console.log(barrier)
            $scope.ctx.fillText('|', barrier.x, barrier.y);
        });

        $scope.$apply();
        /*frame.players.forEach(function(player){
            ctx.fillRect(frame.bullet[i].x-5,frame.bullet[i].y-5,10,10);
        });*/
    });

    $scope.initialize = function(){
        socket.emit('getRooms', {});
        // setInterval(function(){
        //     socket.emit('getRooms', {});    
        // }, 3000);
    };


    socket.on('gameOver', function(data){
        //c;ear canvas
        $scope.playing = false;
        $scope.update = 'Game Over!! You Lost!!';
        $scope.$apply();
    });

    socket.on('gameStarted', function(){
        $scope.playing = true;
        $scope.$apply();
    });

    socket.on('timerId', function(data){
        $scope.timerId = data.timerId;
    });

    socket.on('leftRoom', function(data){
        console.log('left room')
        $scope.update = data.msg;
        $scope.gaming = false;
        $scope.room = {};
        $scope.$apply();
        //clear the canvas
    });

    socket.on('startGameError', function(data){
        $scope.update = $scope.startGameError = true;
        $scope.update = $scope.startgameErrorMsg = data.errorMsg;
        $scope.$apply();
    });

    socket.on('createdRoom', function(data){
        $scope.room = data;
        $scope.gaming = true;
        $scope.creator = true;
        $scope.$apply();
    });

    socket.on('joinedRoom', function(data){
        console.log('joined room')
        $scope.room = data;
        $scope.gaming = true;
        $scope.creator = false;
        $scope.$apply();
    });

    socket.on('joinRoomError', function(data){
        $scope.gaming = false;
        $scope.joinRoomError = true;
        $scope.joinRoomErrorMsg = data.errorMsg;
        $scope.$apply();
    });

    socket.on('createRoomError', function(data){
        $scope.gaming = false;
        $scope.createRoomError = true;
        $scope.createRoomErrorMsg = data.errorMsg;
        $scope.$apply();
    });

    socket.on('update', function(data){
        $scope.gaming = true;
        $scope.update = data.msg;
        $scope.$apply();
    });

    socket.on('roomList', function(data){
        $scope.roomList = [];
        data.rooms.forEach(function(room){
            var temp = room.split('||');
            $scope.roomList.push({
                ownerSocketId: temp[0],
                roomName: temp[1],
                ownerName: temp[2]
            });
        });
        console.log('updated roomlist')
        console.log($scope.roomList)
        $scope.$apply();
    });

    socket.on('newRoom', function(data){
        $scope.roomList.unshift(data);
        socket.emit('getRooms', {});
        $scope.$apply();
    });

    $scope.shoot = function(event){
        if($scope.playing) {
            console.log(event)
            console.log('CALLING SHOOT')
            var x = event.clientX;// - $scope.ctx.getBoundingClientRect().left;
            var y = event.clientY;// - $scope.ctx.getBoundingClientRect().top;
            socket.emit('shoot', {x: x, y: y, roomDetails: $scope.room});
        }
    };

    $scope.createRoom = function(){
        var roomDetails = {
            password: $scope.newRoomPassword,
            roomName: $scope.newRoomName
        };
        console.log(roomDetails)
        socket.emit('createRoom', roomDetails);
    };

    $scope.startGame = function(){
        socket.emit('startGame', $scope.room);
    };

    $scope.joinRoom = function(room){
        var roomDetails = {
            password: $scope.joinRoomPassword,
            roomName: room.roomName,
            ownerSocketId: room.ownerSocketId,
            ownerName: room.ownerName
        };

        socket.emit('joinRoom', roomDetails);
    };

    $scope.leaveRoom = function(){
        console.log('called laevae')
        socket.emit('leaveRoom', $scope.room);
    };


    $scope.keyDown = function(event){
        if($scope.playing) {
            console.log('keyDown')
            console.log(event.keyCode)
            switch(event.keyCode) {
                case 68: 
                    socket.emit('keyPress',{inputId:'right',state:true});
                    break; 
                case 83: 
                    socket.emit('keyPress',{inputId:'down',state:true});
                    break;
                case 65: 
                    socket.emit('keyPress',{inputId:'left',state:true});
                    break;
                case 87:
                    socket.emit('keyPress',{inputId:'up',state:true});
                    break;       
            }
        }    
    }

    $scope.keyUp = function(event){
        if($scope.playing) {
            console.log('keyDown')
            console.log(event.keyCode)
            switch(event.keyCode) {
                case 68: 
                    socket.emit('keyPress',{inputId:'right',state:false});
                    break; 
                case 83: 
                    socket.emit('keyPress',{inputId:'down',state:false});
                    break;
                case 65: 
                    socket.emit('keyPress',{inputId:'left',state:false});
                    break;
                case 87:
                    socket.emit('keyPress',{inputId:'up',state:false});
                    break;       
            }
        }    
    }

}]);

