//
appServices.factory('ExpenseDAL', ['$http', '$q', 'localStorage', 'ngAuthSettings', '$mdDialog', '$mdToast', '$ionicModal', '$mdBottomSheet', function ($http, $q, localStorage, ngAuthSettings, $mdDialog, $mdToast, $ionicModal, $mdBottomSheet) {
    
    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var expenseServiceFactory = {};


    //get borrowers list
    var _getExpenseList = function (query) {

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/EMI/GetExpenseList?query=' + query).success(function (response) {

            if (response != "" && response != '{"Result" : ]}' && response != undefined) {
                response = eval('[' + response + ']')[0].Result;

                var results = response.map(function (item) {
                    return {
                        display: item.expense.trim(),
                        row: item,
                        value: item.id
                    };
                });

                deferred.resolve(results);
            }
            else
                deferred.resolve([]);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };
    //get borrowers list
    var _insertExpense = function (expense) {

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/EMI/MaintainExpense?sAction=insert', expense).success(function (response) {

            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };
    //get borrowers list
    var _updateExpense = function (expense) {

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/EMI/MaintainExpense?sAction=update', expense).success(function (response) {

            deferred.resolve(response);

        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };

    //get borrowers list
    var _deleteExpense = function (expense) {

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/EMI/MaintainExpense?sAction=delete', expense).success(function (response) {

            deferred.resolve(response);

        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };


    var _deleteBorw = function (expense, $event) {
        var deferred = $q.defer();

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


                $http.post(serviceBase + 'api/EMI/MaintainExpense?sAction=delete', expense).success(function (response) {
                    
                        deferred.resolve(response);

                    }).error(function (err, status) {
                        deferred.reject(err);
                    });
                    

            } // End remove contract.
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
                }); // End showing toast.
            }
        }, function () {
            // For cancel button to remove data.
        }); // End alert box.
        return deferred.promise;


    };


    expenseServiceFactory.GetExpenseList = _getExpenseList;
    expenseServiceFactory.InsertExpense = _insertExpense;
    expenseServiceFactory.UpdateExpense = _updateExpense;
    expenseServiceFactory.DeleteExpense = _deleteExpense;
    expenseServiceFactory.Delete = _deleteBorw;
    return expenseServiceFactory;

} ]);

