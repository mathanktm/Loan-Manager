appServices.factory('LoansDAL', ['$http', '$q', 'localStorage', 'ngAuthSettings', '$mdDialog', '$mdToast', '$ionicModal', '$mdBottomSheet', function ($http, $q, localStorage, ngAuthSettings, $mdDialog, $mdToast, $ionicModal, $mdBottomSheet) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var loansServiceFactory = {};


    //get loans list
    var _getLoansList = function (query) {

        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        $http.post(serviceBase + 'api/EMI/GetLoanList?query=' + query).success(function (response) {

            //response = JSON.parse(response);
            if (response != "" && response != '{"Result" : ]}' && response != undefined) {
                response = eval('[' + response + ']')[0].Result;


                var results = response.map(function (item) {
                    return {
                        display: item.loanacctno.trim(),
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
    //get loans details
    var _getLoanDetails = function (loanid, emino) {

        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        $http.post(serviceBase + 'api/EMI/GetLoanDetails?sLoanId=' + loanid + '&sNo=' + emino).success(function (response) {

            //response = JSON.parse(response);
            if (response != "" && response != '{"Result" : ]}' && response != undefined) {
                response = eval('[' + response + ']')[0].Result;

                deferred.resolve(response[0]);
            }
            else
                deferred.resolve([]);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };
    //get loans list
    var _insertLoan = function (loan) {

        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        loan.lastchangeuser = authData.userid;
        $http.post(serviceBase + 'api/EMI/MaintainLoan?sAction=insert', loan).success(function (response) {

            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };

    //get loans list
    var _updateLoan = function (loan) {

        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        loan.lastchangeuser = authData.userid;
        $http.post(serviceBase + 'api/EMI/MaintainLoan?sAction=update', loan).success(function (response) {

            deferred.resolve(response);

        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };

    //get loans list
    var _deleteLoan = function (loan) {

        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        $http.post(serviceBase + 'api/EMI/MaintainLoan?sAction=delete', loan).success(function (response) {

            deferred.resolve(response);

        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };


    var _deleteLn = function (loan, $event) {
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
                    content: "Are you sure to Delete the Loan?",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {


                $http.post(serviceBase + 'api/EMI/MaintainLoan?sAction=delete', loan).success(function (response) {

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


    loansServiceFactory.GetLoansList = _getLoansList;
    loansServiceFactory.BindLoanDetails = _getLoanDetails;
    loansServiceFactory.InsertLoan = _insertLoan;
    loansServiceFactory.UpdateLoan = _updateLoan;
    loansServiceFactory.DeleteLoan = _deleteLoan;
    loansServiceFactory.Delete = _deleteLn;

    return loansServiceFactory;
} ]);

