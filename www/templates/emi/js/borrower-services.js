//
appServices.factory('BorrowersDAL', ['$http', '$q', 'localStorage', 'ngAuthSettings', '$mdDialog', '$mdToast', '$ionicModal', '$mdBottomSheet', function ($http, $q, localStorage, ngAuthSettings, $mdDialog, $mdToast, $ionicModal, $mdBottomSheet) {
    
    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var borrowersServiceFactory = {};


    //get borrowers list
    var _getBorrowersList = function (query) {

        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        $http.post(serviceBase + 'api/EMI/GetBorrowersList?query=' + query).success(function (response) {

            //response = JSON.parse(response);
            if (response != "" && response != '{"Result" : ]}' && response != undefined) {
                response = eval('[' + response + ']')[0].Result;

                var results = response.map(function (item) {
                    return {
                        display: item.borrowername.trim(),
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
    var _insertBorrower = function (borrower) {

        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        $http.post(serviceBase + 'api/EMI/MaintainBorrower?sAction=insert', borrower).success(function (response) {

            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };
    //get borrowers list
    var _updateBorrower = function (borrower) {

        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        $http.post(serviceBase + 'api/EMI/MaintainBorrower?sAction=update', borrower).success(function (response) {

            deferred.resolve(response);

        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };

    //get borrowers list
    var _deleteBorrower = function (borrower) {

        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        $http.post(serviceBase + 'api/EMI/MaintainBorrower?sAction=delete', borrower).success(function (response) {

            deferred.resolve(response);

        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };


    var _deleteBorw = function (borrower, $event) {
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
                    content: "Are you sure to Delete Borrower",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {

                   
                    $http.post(serviceBase + 'api/EMI/MaintainBorrower?sAction=delete', borrower).success(function (response) {
                    
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

    //vehicle list    
    var _getNewVehicleList = function (searchQuery) {

        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        $http.post(serviceBase + 'api/Card/GetVehicleForNewCard?iCustomerId=' + authData.customerid + '&sAccNo=' + authData.accountnumber + '&sVehicle=' + searchQuery).success(function (response) {

            //response = JSON.parse(response);
            if (response != "" && response != '{"Result" : ]}' && response != undefined) {
                response = eval('[' + response + ']');

                var result = response[0].Result.map(function (item) {
                    return {
                        display: item.customersvehicleid.trim(),
                        row: item,
                        value: item.vehicleid
                    };
                });
                deferred.resolve(result);
            }
            else
                deferred.reject('');

        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };

    var _getVehicleWithCardList = function (searchQuery) {

        var deferred = $q.defer();


        var authData = localStorage.get('authorizationData');
        $http.post(serviceBase + 'api/Card/GetVehicleWithCard?iCustomerId=' + authData.customerid + '&sAccNo=' + authData.accountnumber + '&sVehicle=' + searchQuery).success(function (response) {

            //response = JSON.parse(response);
            if (response != "" && response != '{"Result" : ]}' && response != undefined) {
                response = eval('[' + response + ']');
                var result = response[0].Result.map(function (item) {
                    return {
                        display: item.customersvehicleid.trim(),
                        row: item,
                        value: item.vehicleid
                    };
                });
                deferred.resolve(result);
            }
            else
                deferred.reject('');

        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };

    var _getActiveCardList = function (searchQuery) {

        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        $http.post(serviceBase + 'api/Card/GetActiveCard?iCustomerId=' + authData.customerid + '&sAccNo=' + authData.accountnumber + '&sCard=' + searchQuery).success(function (response) {

            //response = JSON.parse(response);
            if (response != "" && response != '{"Result" : ]}' && response != undefined) {
                response = eval('[' + response + ']');
                var result = response.Result.map(function (item) {
                    return {
                        display: item.cardnumber.trim(),
                        row: item,
                        value: item.fuelcardid
                    };
                });
                deferred.resolve(result);
            }
            else
                deferred.reject('');

        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };




    //request new card
    var _requestNewCard = function (cardInfo) {
        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        cardInfo.UserId = authData.userid;
        cardInfo.CustomerId = authData.customerid;
        cardInfo.AccountNumber = authData.accountnumber;

        $http.post(serviceBase + 'api/Card/RequestNewCard', cardInfo).success(function (response) {

            //response = JSON.parse(response);
            deferred.resolve(response);

        }).error(function (err, status) {
            deferred.reject(err);
        });

        return deferred.promise;

    };

    //for reissue card
    var _reissueCard = function (cardInfo) {
        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        cardInfo.UserId = authData.userid;
        cardInfo.CustomerId = authData.customerid;
        cardInfo.AccountNumber = authData.accountnumber;

        $http.post(serviceBase + 'api/Card/ReissueCard', cardInfo).success(function (response) {

            deferred.resolve(response);

        }).error(function (err, status) {
            deferred.reject(err);
        });

        return deferred.promise;

    };

    //for terminate card
    var _terminateCard = function (cardInfo) {
        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        cardInfo.UserId = authData.userid;
        cardInfo.CustomerId = authData.customerid;
        cardInfo.AccountNumber = authData.accountnumber;

        $http.post(serviceBase + 'api/Card/TerminateCard', cardInfo).success(function (response) {

            deferred.resolve(response);

        }).error(function (err, status) {
            deferred.reject(err);
        });

        return deferred.promise;

    };


    borrowersServiceFactory.GetBorrowersList = _getBorrowersList;
    borrowersServiceFactory.InsertBorrower = _insertBorrower;
    borrowersServiceFactory.UpdateBorrower = _updateBorrower;
    borrowersServiceFactory.DeleteBorrower = _deleteBorrower;
    borrowersServiceFactory.Delete = _deleteBorw;
    

    borrowersServiceFactory.GetNewVehicleList = _getNewVehicleList;

    borrowersServiceFactory.GetVehicleWithCardList = _getVehicleWithCardList;
    borrowersServiceFactory.GetActiveCardList = _getActiveCardList;

    borrowersServiceFactory.RequestNewCard = _requestNewCard;
    borrowersServiceFactory.ReissueCard = _reissueCard;
    borrowersServiceFactory.TerminateCard = _terminateCard;

    return borrowersServiceFactory;
} ]);

