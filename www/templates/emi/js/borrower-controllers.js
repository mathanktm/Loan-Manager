//borrowers controllers
appControllers.controller('borrowersCtrl', function ($scope, $stateParams, $filter, $mdDialog, $mdToast, $ionicHistory, $timeout, $ionicModal, $state, $mdBottomSheet, BorrowersDAL) {
    
    $scope.borrowerInfo = {
        borrowersList: []
    };

    $scope.bindBorrowers = function(){

         // list of shift to address value/display objects
        BorrowersDAL.GetBorrowersList('').then(function (response) {
            $scope.borrowerInfo.borrowersList = response;
            console.log($scope.borrowerInfo.borrowersList);
        },
         function (err) {

         });

    };

     $scope.deleteBor = function(borrower, $event){

        BorrowersDAL.Delete(borrower, $event).then(function (response) {
            $scope.bindBorrowers();
        },
        function (err) {
        });

    };

    $scope.navigateTo = function (targetPage, objectData) {
        $timeout(function () {
            $state.go(targetPage, {
                borrowerdetail: objectData,
                actionDelete: (objectData == null ? false : true)
            });
        }, 400);
    }; // End navigateTo.

   
   $scope.bindBorrowers();

    

   });



appControllers.controller('borrowersDetailCtrl', function ($scope, $stateParams, $filter, $mdDialog, $mdToast, $ionicHistory, $timeout, $ionicModal, $state, $mdBottomSheet, BorrowersDAL) {

 $scope.borrowerInfo = {
        borrower : []
    };


    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page 
    // and sending objectData to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $timeout(function () {
            $state.go(targetPage, {
                borrowerdetail: objectData,
                actionDelete: (objectData == null ? false : true)
            });
        }, 400);
    }; // End navigateTo.


    // getContractData is for get contract detail data.
    $scope.getBorrowerData = function (actionDelete, borrowerdetail) {
        // tempContract is  temporary contract data detail.
        var tempContract = {
           id : 0,
           borrowerno : '',
           borrowername	: '',
           address	: '',
           email	: '',
           mobileno : ''
        }
        // If actionDelete is true Contract Detail Page will show contract detail that receive form contract list page.
        // else it will show tempContract for user to add new data.
        return (actionDelete ? angular.copy(borrowerdetail) : tempContract);
    }; //End get contract detail data.


    // saveBorrower is for save contract.
    // Parameter :  
    // contract(object) = contract object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.saveBorrower = function (borrower, $event) {
        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to save data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    content: "Are you sure to Updaste Borrower",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {

            // For confirm button to save data.
            try {
                // To update data by calling ContractDB.update(contract) service.
                if ($scope.actionDelete) {
                    
                    //if ($scope.contract.id == null) {
                    //    $scope.contract.id = $scope.contractList[$scope.contractList.length - 1].id;
                    //}
                    //ContractDB.update(contract);

                    //update
                    BorrowersDAL.UpdateBorrower(borrower).then(function (response) {
                        //$scope.borrowerInfo.borrowersList = response;
                        $ionicHistory.goBack();
                    },
                    function (err) {
                        $ionicHistory.goBack();
                    });

                } // End update data. 

                // To add new data by calling ContractDB.add(contract) service.
                else {
                    //ContractDB.add(contract);
                     //adde
                    BorrowersDAL.InsertBorrower(borrower).then(function (response) {
                       //$scope.borrowerInfo.borrowersList = response;
                        //go back
                        $ionicHistory.goBack();
                    },
                    function (err) {
                         //go back
                        $ionicHistory.goBack();

                    });

                    //$scope.contractList = ContractDB.all();
                    $scope.actionDelete = true;
                }// End  add new  data. 

               

                // Showing toast for save data is success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 1400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Borrower Successfully Saved !"
                        }
                    }
                });//End showing toast.
            }
            catch (e) {
                // Showing toast for unable to save data.
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
                });//End showing toast.
            }
        }, function () {
            // For cancel button to save data.
        });// End alert box.
    };// End save contract.


     $scope.deleteBor = function(borrower, $event){

        BorrowersDAL.Delete(borrower, $event).then(function (response) {
            $ionicHistory.goBack();
        },
        function (err) {
            $ionicHistory.goBack();
        });

    };


    // deleteBorrower is for remove contract.
    // Parameter :  
    // contract(object) = contract object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.deleteBorrower = function (borrower, $event) {
        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    content: "Are you sure to Delete Borrower",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {
                // Remove contract by calling ContractDB.remove(contract)service.
//                if ($scope.contract.id == null) {
//                    $scope.contract.id = $scope.contractList[$scope.contractList.length - 1].id;
//                }
                //ContractDB.remove(contract);
                BorrowersDAL.DeleteBorrower(borrower).then(function (response) {
                        $ionicHistory.goBack();
                        
                    },
                    function (err) {
                        $ionicHistory.goBack();
                    });

                //$ionicHistory.goBack();

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

    // validateRequiredField is for validate the required field.
    // Parameter :  
    // form(object) = contract object that presenting on the view.
    $scope.validateRequiredField = function (form) {
        return !(   (form.borrowername.$error.required == undefined)
        //&& (form.address.$error.required == undefined)
        && (form.mobileno.$error.required == undefined));
    };// End validate the required field. 

    // showListBottomSheet is for showing the bottom sheet.
    // Parameter :  
    // $event(object) = position of control that user tap.
    // contractForm(object) = contract object that presenting on the view.
    $scope.showListBottomSheet = function ($event, contractForm) {
        $scope.disableSaveBtn = $scope.validateRequiredField(contractForm);
        $mdBottomSheet.show({
            templateUrl: 'contract-actions-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End showing the bottom sheet.



    // $scope.disableSaveBtn is  the variable for setting disable or enable the save button.
    $scope.disableSaveBtn = false;

    // $scope.contract is the variable that store contract detail data that receive form contract list page.
    // Parameter :  
    // $stateParams.actionDelete(bool) = status that pass from contract list page.
    // $stateParams.contractdetail(object) = contract that user select from contract list page.
    $scope.borrowerInfo.borrower = $scope.getBorrowerData($stateParams.actionDelete, $stateParams.borrowerdetail);

    //$scope.actionDelete is the variable for allow or not allow to delete data.
    // It will allow to delete data when have data in the database.
    $scope.actionDelete = $stateParams.actionDelete;
});
