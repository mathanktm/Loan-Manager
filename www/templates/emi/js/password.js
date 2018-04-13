//borrowers controllers
appControllers.controller('passwordCtrl', function ($scope, $stateParams, $filter, $mdDialog, $mdToast, $ionicHistory, $timeout, $ionicModal, $state, $mdBottomSheet, PasswordDAL) {
    

    $scope.passwordInfo = {
        userid : 0,
        currentpwd : "",
        newpwd : "",
        confirmpwd : ""
    };
        
   

    $scope.navigateTo = function (targetPage, objectData) {
        $timeout(function () {
            $state.go(targetPage, {
                borrowerdetail: objectData,
                actionDelete: (objectData == null ? false : true)
            });
        }, 400);
    }; // End navigateTo.

   
   
    //closing loan
    $scope.changePwd = function (passwordInfo, $event) {
        
        if( passwordInfo.newpwd != passwordInfo.confirmpwd)
        {
            alert("Confirm Password doesn''t Match!");
            return;
        }

        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to Change Password?",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {


                
                PasswordDAL.ChangePassword(passwordInfo).then(function (response) {
                       

                        $mdToast.show({
                        controller: 'toastController',
                        templateUrl: 'toast.html',
                        hideDelay: 1400,
                        position: 'top',
                        locals: {
                            displayOption: {
                                title: response.Result
                            }
                        }
                        });

                        $ionicHistory.goBack();
                        
                    },
                    function (err) {
                        $ionicHistory.goBack();
                    });


            }// End remove contract.
            catch (e) {
                // Showing toast for unable to remove data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 1800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });// End showing toast.
            }
        }, function () {
            // For cancel button to remove data.
        });// End alert box.
    };// End remove contract.


    // showListBottomSheet is for showing the bottom sheet.
    // Parameter :  
    // $event(object) = position of control that user tap.
    // contractForm(object) = contract object that presenting on the view.
    $scope.validateRequiredField = function (form) {
        return !((form.newpwd.$error.required == undefined)
        && (form.confirmpwd.$error.required == undefined)
        && (form.currentpwd.$error.required == undefined)
        );
    }; // End validate the required field. 

     $scope.showListBottomSheet = function ($event, passwordForm) {
        $scope.disableSaveBtn = $scope.validateRequiredField(passwordForm);
        $mdBottomSheet.show({
            templateUrl: 'contract-actions-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End showing the bottom sheet.


    // $scope.disableSaveBtn is  the variable for setting disable or enable the save button.
    $scope.disableSaveBtn = false;

    //$scope.actionDelete is the variable for allow or not allow to delete data.
    // It will allow to delete data when have data in the database.
    $scope.actionDelete = $stateParams.actionDelete;


   });



   //
appServices.factory('PasswordDAL', ['$http', '$q', 'localStorage', 'ngAuthSettings', '$mdDialog', '$mdToast', '$ionicModal', '$mdBottomSheet', function ($http, $q, localStorage, ngAuthSettings, $mdDialog, $mdToast, $ionicModal, $mdBottomSheet) {
    
    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var pwdServiceFactory = {};


   
    //get borrowers list
    var _changePwd = function (pwdInfo) {

        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        pwdInfo.userid = authData.userid;
        $http.post(serviceBase + 'api/EMI/ChangePassword', pwdInfo).success(function (response) {

            //response = JSON.parse(response);
            if (response != "" && response != '{"Result" : ]}' && response != "Error") {
                response = eval('[' + response + ']')[0].Result;

                deferred.resolve(response[0]);
            }
            else
                deferred.resolve(response);

        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };

    pwdServiceFactory.ChangePassword = _changePwd;

    return pwdServiceFactory;
} ]);

