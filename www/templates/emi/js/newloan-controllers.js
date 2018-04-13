//loan controllers
appControllers.controller('newloanCtrl', function ($scope, $stateParams, $filter, $mdDialog, $mdToast, $ionicHistory, $timeout, $ionicModal, $state, $mdBottomSheet, LoansDAL) {
    
    $scope.loanInfo = {
        loansList: []
    };

    $scope.bindLoans = function(){

         // list of shift to address value/display objects
        LoansDAL.GetLoansList('').then(function (response) {
            $scope.loanInfo.loansList = response;
            //console.log($scope.loanInfo.loansList);
        },
         function (err) {

         });

    };

     $scope.deleteLn = function(loan, $event){

        LoansDAL.Delete(loan, $event).then(function (response) {
            $scope.bindLoans();
        },
        function (err) {
        });

    };

    $scope.navigateTo = function (targetPage, objectData) {
        $timeout(function () {
            $state.go(targetPage, {
                newloandetail: objectData,
                actionDelete: (objectData == null ? false : true)
            });
        }, 400);
    }; // End navigateTo.

   
   $scope.bindLoans();


   

   }); //end of controller




appControllers.controller('newloanDetailCtrl', function ($scope, $stateParams, $filter, $mdDialog, $mdToast, $ionicHistory, $timeout, $ionicModal, $state, $mdBottomSheet, LoansDAL, BorrowersDAL) {

 $scope.loanInfo = {
        sanctioneddate : '',
        loan : []
    };

     //borrowers list
    $scope.borrowerInfo = {
            borrowersList : [],
            selectedItem : "",
            searchText : "",
            selectedRow : ""
    };
    
    $scope.loanInfo.sanctioneddate = new Date();
            
    $scope.borrowerInfo.selectedItem  = null;
    $scope.borrowerInfo.searchText    = null;
    $scope.queryBorrowerSearch    = queryBorrowerSearch;
    $scope.borrowerInfo.selectedBorrower = function (item)
    {
        $scope.borrowerInfo.selectedRow = item;
    }

   
   
   function queryBorrowerSearch(query) {
            
            var results;
            if(query != "")
            {
                $scope.borrowerInfo.borrowersList = BorrowersDAL.GetBorrowersList(query);

                results =  $scope.borrowerInfo.borrowersList;
            }
            else
                results =[];
            console.log(results)
            return results;

// if(query != "" && query != undefined)
//            {
//                 BorrowersDAL.GetBorrowersList(query).then(function(response)
//                 {
//                    var results =  response.map( function (item) {
//                        return {
//                        display: item.borrowername.trim(), 
//                        row :  item,
//                        value:   item.id
//                        };
//                });
//                        $scope.borrowerInfo.borrowersList = results;
//                        console.log($scope.borrowerInfo.borrowersList);
//                 },
//                 function (ex){
//                     $scope.borrowerInfo.borrowersList = [];
//                     
//                 }); 
//            }

        }

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page 
    // and sending objectData to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $timeout(function () {
            $state.go(targetPage, {
                newloandetail: objectData,
                actionDelete: (objectData == null ? false : true)
            });
        }, 400);
    }; // End navigateTo.


    // getContractData is for get contract detail data.
    $scope.getLoanData = function (actionDelete, loandetail) {
        // tempContract is  temporary contract data detail.
        var tempContract = {
           id : 0,
           loanno : '',
           loanname	: '',
           address	: '',
           email	: '',
           mobileno : ''
        }
        // If actionDelete is true Contract Detail Page will show contract detail that receive form contract list page.
        // else it will show tempContract for user to add new data.
        return (actionDelete ? angular.copy(loandetail) : tempContract);
    }; //End get contract detail data.


    // saveloan is for save contract.
    // Parameter :  
    // contract(object) = contract object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.saveLoan = function (loan, $event) {
        //$mdBottomSheet.hide() use for hide bottom sheet.

        if( loan.sanctioneddate != "")
        {
            loan.sanctioneddate = $scope.loanInfo.sanctioneddate;
            loan.sanctioneddate = loan.sanctioneddate.toLocaleDateString();
        }

        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to save data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    content: "Are you sure to Update the Loan?",
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
                    LoansDAL.UpdateLoan(loan).then(function (response) {
                        //$scope.loanInfo.borrowersList = response;
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

                        //bind autocomplete value
                    loan.borrowerid = $scope.borrowerInfo.selectedRow.row.id; 

                    //loan.sanctioneddate = $filter('date')(new Date($scope.sanctioneddate),'MM/dd/yyyy');


                    LoansDAL.InsertLoan(loan).then(function (response) {
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
                            title: "Loan Successfully Updated"
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


     $scope.deleteLn = function(loan, $event){

        LoansDAL.Delete(loan, $event).then(function (response) {
            $ionicHistory.goBack();
        },
        function (err) {
            $ionicHistory.goBack();
        });

    };


    // deleteloan is for remove contract.
    // Parameter :  
    // contract(object) = contract object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.deleteLoan = function (loan, $event) {
        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    content: "Are you sure to Delete the Loan?",
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
                LoansDAL.DeleteLoan(loan).then(function (response) {
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
        && (form.loanamount.$error.required == undefined)
        && (form.interestrate.$error.required == undefined)
        && (form.tenure.$error.required == undefined)
        && (form.frequency.$error.required == undefined)
        && (form.sanctioneddate.$error.required == undefined)
        
        );
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


    $scope.showListBottomSheetForUpdate = function ($event, contractForm) {
        $scope.disableSaveBtn = false;
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
    $scope.loanInfo.loan = $scope.getLoanData($stateParams.actionDelete, $stateParams.newloandetail);

    //$scope.actionDelete is the variable for allow or not allow to delete data.
    // It will allow to delete data when have data in the database.
    $scope.actionDelete = $stateParams.actionDelete;
});
