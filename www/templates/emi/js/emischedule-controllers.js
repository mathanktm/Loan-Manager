//borrowers controllers
appControllers.controller('emischeduleCtrl', function ($scope, $stateParams, $filter, $mdDialog, $mdToast, $ionicHistory, $timeout, $ionicModal, $state, $mdBottomSheet, EMIDAL) {
    
    $scope.emischeduleInfo = {
        startdate : "",
        enddate : "",
        fromdate: null,
        todate : null,
        ispaid : 0,
        emilist : []
    };


    $scope.emischeduleInfo.fromdate = new Date();

    
    var tdDate = new Date();
    tdDate.setDate(tdDate.getDate()+30);
    $scope.emischeduleInfo.todate = tdDate; 


    $scope.bindEMIList = function(){

         // list of shift to address value/display objects
        $scope.emischeduleInfo.startdate  = $filter('date')(new Date($scope.emischeduleInfo.fromdate),'MM/dd/yyyy');
        $scope.emischeduleInfo.enddate  = $filter('date')(new Date($scope.emischeduleInfo.todate),'MM/dd/yyyy');

        EMIDAL.BindEMIList($scope.emischeduleInfo).then(function (response) {
            $scope.emischeduleInfo.emilist = response;
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

   
    $scope.bindEMIList($scope.emischeduleInfo);

    

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
    //$scope.borrowerInfo.borrower = $scope.getBorrowerData($stateParams.actionDelete, $stateParams.borrowerdetail);

    //$scope.actionDelete is the variable for allow or not allow to delete data.
    // It will allow to delete data when have data in the database.
    $scope.actionDelete = $stateParams.actionDelete;
});
