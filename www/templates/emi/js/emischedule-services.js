//
appServices.factory('EMIDAL', ['$http', '$q', 'localStorage', 'ngAuthSettings', '$mdDialog', '$mdToast', '$ionicModal', '$mdBottomSheet', function ($http, $q, localStorage, ngAuthSettings, $mdDialog, $mdToast, $ionicModal, $mdBottomSheet) {
    
    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var emiServiceFactory = {};


    //get borrowers list
    var _bindEMIListt = function (emischeduleInfo) {

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/EMI/BindEMIList?sFromDate=' + emischeduleInfo.startdate + '&sToDate=' + emischeduleInfo.enddate + '&sIsPaid=' + emischeduleInfo.ispaid).success(function (response) {

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
    
    emiServiceFactory.BindEMIList = _bindEMIListt;
    
    return emiServiceFactory;
} ]);

