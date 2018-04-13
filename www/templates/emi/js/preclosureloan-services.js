//
appServices.factory('PreClosureLoanDAL', ['$http', '$q', 'localStorage', 'ngAuthSettings', '$mdDialog', '$mdToast', '$ionicModal', '$mdBottomSheet', function ($http, $q, localStorage, ngAuthSettings, $mdDialog, $mdToast, $ionicModal, $mdBottomSheet) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var closeLoanServiceFactory = {};



    //get borrowers list
    var _closeLoan = function (preClosureLoan) {

        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        preClosureLoan.lastchangeuser = authData.userid;
        $http.post(serviceBase + 'api/EMI/PreClosureLoan?sAction=test', preClosureLoan).success(function (response) {

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

    //get borrowers list
    var _getEMITable = function (loanid) {

        var deferred = $q.defer();
        $http.post(serviceBase + 'api/EMI/GetEMITable?sLoanId=' + loanid).success(function (response) {

            //response = JSON.parse(response);
            if (response != "" && response != '{"Result" : ]}' && response != undefined) {
                response = eval('[' + response + ']')[0].Result;

                deferred.resolve(response);
            }
            else
                deferred.resolve([]);

        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;

    };

    closeLoanServiceFactory.PreCloseLoan = _closeLoan;
    closeLoanServiceFactory.GetEMITable = _getEMITable;

    return closeLoanServiceFactory;
} ]);

