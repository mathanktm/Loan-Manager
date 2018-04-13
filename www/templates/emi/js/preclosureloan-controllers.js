//borrowers controllers
appControllers.controller('preclosureloanCtrl', function ($scope, $stateParams, $filter, $mdDialog, $mdToast, $ionicHistory, $timeout, $ionicModal, $state, $mdBottomSheet, PreClosureLoanDAL, LoansDAL) {
    

    $scope.loanInfo = {
        loansList: [],
        selectedItem : "",
        searchText : "",
        selectedRow : ""
    };
        
    $scope.loanInfo.selectedItem  = null;
    $scope.loanInfo.searchText    = null;
    $scope.queryLoanSearch    = queryLoanSearch;
    $scope.loanInfo.selectedLoan = function (item)
    {
        $scope.loanInfo.selectedRow = item;
        $scope.preClosureLoan.closingpercentage = "";
        $scope.preClosureLoan.closingamount = "";
        jQuery('#device-information-content').fadeIn();
    }

       //for emi table
       //jQuery('#device-information-content').fadeIn();
       $scope.emitable = [];
     $scope.loanInfo.selectedLoanforEMI = function (item)
    {
        $scope.loanInfo.selectedRow = item;
        $scope.preClosureLoan.closingpercentage = "";
        $scope.preClosureLoan.closingamount = "";
        

        PreClosureLoanDAL.GetEMITable($scope.loanInfo.selectedRow.row.id).then(function(response) {
            $scope.emitable = response; 
         },
        function (err) {
             $scope.emitable = [];
        });


        jQuery('#device-information-content').fadeIn();
    }

    //jQuery('#device-information-content').fadeIn();

    $scope.preClosureLoan = {

        id : 0,
        loanid : 0,
        closingprincipal : "",
        closingpercentage : "",
        closingamount : "",
        lastchangeuser : 0
    };
   
     $scope.calculateNetPay = function() {
        
       //console.log($scope.preClosureLoan.closingprincipal);
       $scope.preClosureLoan.closingamount = parseFloat(parseFloat(closingprincipal.value) + (parseFloat(closingprincipal.value) * parseFloat($scope.preClosureLoan.closingpercentage) /100 )).toFixed(2);

    };
   
   function queryLoanSearch(query) {
            
            var results;
            if(query != "")
            {
                $scope.loanInfo.loansList = LoansDAL.GetLoansList(query);

                results =  $scope.loanInfo.loansList;
            }
            else
                results =[];
            console.log(results)
            return results;

        }
    

    $scope.navigateTo = function (targetPage, objectData) {
        $timeout(function () {
            $state.go(targetPage, {
                borrowerdetail: objectData,
                actionDelete: (objectData == null ? false : true)
            });
        }, 400);
    }; // End navigateTo.

   
   
    //closing loan
    $scope.closeLoan = function (preCloseLoan, $event) {
        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    content: "Are you sure to Close Loan?",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {

                preCloseLoan.loanid =  $scope.loanInfo.selectedRow.row.id;  
                preCloseLoan.closingprincipal =  $scope.loanInfo.selectedRow.row.openbalance;  

                PreClosureLoanDAL.PreCloseLoan(preCloseLoan).then(function (response) {
                       

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
        return !((form.loanname.$error.required == undefined)
        && (form.closingprincipal.$error.required == undefined)
        && (form.closingpercentage.$error.required == undefined)
        && (form.closingamount.$error.required == undefined)
        );
    }; // End validate the required field. 

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

    //$scope.actionDelete is the variable for allow or not allow to delete data.
    // It will allow to delete data when have data in the database.
    $scope.actionDelete = $stateParams.actionDelete;


   });



