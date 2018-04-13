// Controller of menu dashboard page.
appControllers.controller('menuDashboardCtrl', function ($scope, $cordovaSms, $filter, $mdToast, $timeout, $state, $stateParams, $ionicHistory, authService, EMIDAL) {


    //$scope.isAnimated is the variable that use for receive object data from state params.
    //For enable/disable row animation.
    $scope.isAnimated = $stateParams.isAnimated;


    $scope.logout = function () {


        authService.logOut().then(function (response) {

            $state.go('app.login');
        },
         function (err) {

         });
    };

    //send sms
    $scope.emischeduleInfo1 = {
        startdate: "",
        enddate: "",
        fromdate: null,
        todate: null,
        ispaid: 0,
        emilist: []
    };

    $scope.emischeduleInfo1.fromdate = new Date();

    var tdDate = new Date();
    tdDate.setDate(tdDate.getDate() + 30);
    $scope.emischeduleInfo1.todate = tdDate;

    $scope.sendSMS = function () {

        // list of shift to address value/display objects
        $scope.emischeduleInfo1.startdate = $filter('date')(new Date($scope.emischeduleInfo1.fromdate), 'MM/dd/yyyy');
        $scope.emischeduleInfo1.enddate = $filter('date')(new Date($scope.emischeduleInfo1.todate), 'MM/dd/yyyy');

        //document.addEventListener("deviceready", function () {

            //alert('ready');
            //CONFIGURATION
            var options = {
                replaceLineBreaks: true, // true to replace \n by a new line, false by default
                android: {
                    //intent: 'INTENT'  // send SMS with the native android SMS messaging
                    intent: '' // send SMS without open any other app
                }
            };


            // Showing toast for save data is success.
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 0,
                position: 'bottom',
                locals: {
                    displayOption: {
                        title: "SMS Sending.. Please Wait"
                    }
                }
            }); //End showing toast.

        EMIDAL.BindEMIList($scope.emischeduleInfo1).then(function (response) {
            //$scope.emischeduleInfo1.emilist = response;
            //lert('ready');

            $.map(response, function(item, index)
            {
                //alert(item.mobileno);
                if(item.mobileno != '')
                {
                    var smsMessage= "Hi " + item.borrowername + '\n'
                    smsMessage = smsMessage + 'EMI Amt-Rs.' + item.installmentamount + '\n'
                    smsMessage = smsMessage + 'Installment No-' + item.installmentno + '\n'
                    smsMessage = smsMessage + 'Due Date-' + item.emidate + '\nThank you--By Chandrasekar'
                    alert(smsMessage);
                    //.send('phonenumber', 'SMS content', options)
                    $cordovaSms.send('9841270665', smsMessage, options)
                    .then(function () {
                        // Success! SMS was sent
                        //alert('success');
                    }, function (error) {
                        alert('No sent SMS');
                        //alert(error);
                    });
                }

            });

            // Showing toast for save data is success.
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 1400,
                position: 'top',
                locals: {
                    displayOption: {
                        title: "SMS Sent Successfully"
                    }
                }
            }); //End showing toast.

        },
         function (err) {

         });
         

    //});

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
        }, ($scope.isAnimated ? 300 : 0));
    }; // End of navigateTo.

    // goToSetting is for navigate to Dashboard Setting page
    $scope.goToSetting = function () {
        $state.go("app.dashboardSetting");
    }; // End goToSetting.

    //ShowToast for show toast when user press button.
    $scope.showToast = function (menuName) {
        //Calling $mdToast.show to show toast.
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 800,
            position: 'top',
            locals: {
                displayOption: {
                    title: 'Going to ' + menuName + " !!"
                }
            }
        });
    } // End showToast.
});        // End of controller menu dashboard.