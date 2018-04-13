//Expense controllers
appControllers.controller('expenseCtrl', function ($scope, $stateParams, $filter, $mdDialog, $mdToast, $ionicHistory, $timeout, $ionicModal, $state, $mdBottomSheet, ExpenseDAL) {
    
    $scope.expenseInfo = {
        expenseList: []
    };

    $scope.bindExpense = function(){

         // list of shift to address value/display objects
        ExpenseDAL.GetExpenseList('').then(function (response) {
            $scope.expenseInfo.expenseList = response;
            console.log($scope.expenseInfo.expenseList);
        },
         function (err) {

         });

    };

     $scope.deleteBor = function(expense, $event){

        ExpenseDAL.Delete(expense, $event).then(function (response) {
            $scope.bindExpense();
        },
        function (err) {
        });

    };

    $scope.navigateTo = function (targetPage, objectData) {
        $timeout(function () {
            $state.go(targetPage, {
                expensedetail: objectData,
                actionDelete: (objectData == null ? false : true)
            });
        }, 400);
    }; // End navigateTo.

   
   $scope.bindExpense();

});

appControllers.controller('expenseDetailCtrl', function ($scope, $stateParams, $filter, $mdDialog, $mdToast, $ionicHistory, $timeout, $ionicModal, $state, $mdBottomSheet, ExpenseDAL) {

 $scope.expenseInfo = {
        expensedate : '',
        expense : []
    };

    $scope.expenseInfo.expensedate = new Date();

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page 
    // and sending objectData to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $timeout(function () {
            $state.go(targetPage, {
                expensedetail: objectData,
                actionDelete: (objectData == null ? false : true)
            });
        }, 400);
    }; // End navigateTo.


    // getContractData is for get contract detail data.
    $scope.getExpenseData = function (actionDelete, expensedetail) {
        // tempContract is  temporary contract data detail.
        var tempContract = {
           id : 0,
           expense : '',
           amount	: '',
           comment	: '',
           expensedate	: ''
        }
        // If actionDelete is true Contract Detail Page will show contract detail that receive form contract list page.
        // else it will show tempContract for user to add new data.
        return (actionDelete ? angular.copy(expensedetail) : tempContract);
    }; //End get contract detail data.


    // saveExpense is for save contract.
    // Parameter :  
    // contract(object) = contract object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.saveExpense = function (expense, $event) {
        //$mdBottomSheet.hide() use for hide bottom sheet.
        expense.expensedate = $scope.expenseInfo.expensedate;
        expense.expensedate = expense.expensedate.toLocaleDateString();

        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to save data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    content: "Are you sure to Updaste Expense",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {

            // For confirm button to save data.
            try {
                // To update data by calling ContractDB.update(contract) service.
                if ($scope.actionDelete) {
                    
                    //update
                    ExpenseDAL.UpdateExpense(expense).then(function (response) {
                        $ionicHistory.goBack();
                    },
                    function (err) {
                        $ionicHistory.goBack();
                    });

                } // End update data. 

                // To add new data by calling ContractDB.add(contract) service.
                else {
                     //add
                    ExpenseDAL.InsertExpense(expense).then(function (response) {
                        $ionicHistory.goBack();
                    },
                    function (err) {
                        $ionicHistory.goBack();
                    });
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
                            title: "Expense Successfully Saved !"
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


     $scope.deleteBor = function(expense, $event){

        ExpenseDAL.Delete(expense, $event).then(function (response) {
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
    $scope.deleteExpense = function (expense, $event) {
        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    content: "Are you sure to Delete Expense",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {
                ExpenseDAL.DeleteExpense(expense).then(function (response) {
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

    // validateRequiredField is for validate the required field.
    // Parameter :  
    // form(object) = contract object that presenting on the view.
    $scope.validateRequiredField = function (form) {
        return !(   (form.expense.$error.required == undefined)
        //&& (form.address.$error.required == undefined)
        && (form.amount.$error.required == undefined));
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
    $scope.expenseInfo.expense = $scope.getExpenseData($stateParams.actionDelete, $stateParams.expensedetail);

    //$scope.actionDelete is the variable for allow or not allow to delete data.
    // It will allow to delete data when have data in the database.
    $scope.actionDelete = $stateParams.actionDelete;
});
