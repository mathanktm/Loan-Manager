//borrowers controllers
appControllers.controller('loanPaymentCtrl', function ($scope, $stateParams, $filter, $mdDialog, $mdToast, $ionicHistory, $timeout, $ionicModal, $state, $mdBottomSheet, PaymentLoanDAL, LoansDAL) {
    

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
        $scope.BindDueDate(item.row.id);
        jQuery('#device-information-content').fadeIn();
    }


    $scope.paymentinfo = {
        emidates : [],
        emino : "",
        eminfo : []
    };

    $scope.changeEMIDate = function() {
        $scope.BindLoanDetails($scope.loanInfo.selectedItem.value, $scope.paymentinfo.emino );
    };

//    $scope.paymentinfo.emidates = [
//    {
//        id : 1,
//        date : "APR",
//        seq : "1"
//    },
//    {
//        id : 2,
//        date : "MAR",
//        seq : "2"
//    }];
   
   
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

   $scope.BindDueDate = function(loanid)
   {
            if(loanid != "" && loanid != undefined)
            {
                PaymentLoanDAL.BindDueDate(loanid).then(function (response) {
                       
                        $scope.paymentinfo.emidates = response;
                        console.log($scope.paymentinfo.emidates);

                    },
                    function (err) {
                        $scope.paymentinfo.emidates = [];
                    });

            }
            else
                $scope.paymentinfo.emidates = [];
   };
   
   $scope.BindLoanDetails = function(loanid, emino)
   {
            if(loanid != "" && loanid != undefined && emino != "" && emino != undefined)
            {
                LoansDAL.BindLoanDetails(loanid, emino).then(function (response) {
                       
                        $scope.paymentinfo.eminfo = response;
                        //console.log(response);

                    },
                    function (err) {
                        $scope.paymentinfo.eminfo = [];
                    });

            }
            else
            {
            $scope.paymentinfo.eminfo = [];
            }
               
   };
   

    //closing loan
    $scope.payLoan = function ( $event) {
    
        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to Payment?",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {
                var lonid = $scope.loanInfo.selectedItem.value;
                var emino = $scope.paymentinfo.emino;

                PaymentLoanDAL.LoanRepayment(lonid, emino).then(function (response) {

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
                      
                      //bind date
                      $scope.BindDueDate($scope.loanInfo.selectedItem.value);  
                      //$scope.paymentinfo.emino = 0;
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
        && (form.emidate.$error.required == undefined)
        );
    }; // End validate the required field. 

     $scope.showListBottomSheetPayment = function ($event, contractForm) {
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



