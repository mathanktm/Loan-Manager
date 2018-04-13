// Controller of menu toggle.
// Learn more about Sidenav directive of angular material
// https://material.angularjs.org/latest/#/demo/material.components.sidenav
appControllers.controller('loginCtrl', function ($rootScope, $scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPopup, localStorage, authService, ngAuthSettings) {

    
    $scope.loginResult = "";
    $scope.loginData = {
        userName: "",
        password: "",
        useRefreshTokens: false
    };

    $rootScope.userinfo;
    $scope.message = "";

    //$mdSidenav('left').toggle();

    $scope.login = function () {

        $scope.loginResult = "";
        authService.login($scope.loginData).then(function (response) {
            
            response = JSON.parse(response)
            
            if ( response.result == "1")
             {
                
                
                $rootScope.userinfo = JSON.parse(response.message);
                
                localStorage.set('authorizationData', { userid: $rootScope.userinfo.webuserid, customerid : $rootScope.userinfo.customerid, roleid : $rootScope.userinfo.roleid, accountnumber : $rootScope.userinfo.accountnumber,  firstname : $rootScope.userinfo.firstname, lastname : $rootScope.userinfo.lastname });
                
                $state.go('app.menuDashboard');
                
             }
             else
             {
                $scope.loginResult = response.message;
                localStorage.removeAll('authorizationData');
             }

        },
         function (err) {
            $scope.loginResult = 'Please check your credentials!';
         });
    };


    
    
   
    
    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination state. 
    // Parameter :  
    // stateNames = target state to go.
    $scope.navigateTo = function (stateName) {
        $timeout(function () {
            if ($ionicHistory.currentStateName() != stateName) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: false
                });
                $state.go(stateName);
            }
        }, ($scope.isAnimated  ? 300 : 0));
    }; // End of navigateTo.
   
}); // End of menu toggle controller.