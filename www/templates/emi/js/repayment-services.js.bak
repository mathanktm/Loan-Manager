//
appServices.factory('PaymentLoanDAL', ['$http', '$q', 'localStorage', 'ngAuthSettings', '$mdDialog', '$mdToast', '$ionicModal', '$mdBottomSheet', function ($http, $q, localStorage, ngAuthSettings, $mdDialog, $mdToast, $ionicModal, $mdBottomSheet) {
    
    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var paymentLoanServiceFactory = {};


   
    //get borrowers list
    var _bindDueDate = function (loanid) {

        var deferred = $q.defer();
        $http.post(serviceBase + 'api/EMI/BindDueDate?sLoanId='+ loanid).success(function (response) {

            //response = JSON.parse(response);
            if (response != "" && response != '{"Result" : ]}' && response != undefined) {
                response = eval('[' + response + ']')[0].Result;


                var results = response.map(function (item) {
                    return {
                        display: item.installmentno + ' - ' + item.emidate + ' - ' + item.ispaid,
                        row: item,
                        value: item.installmentno
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
    var _loanRepayment = function (loanid, emino) {

        var deferred = $q.defer();

        //var authData = localStorage.get('authorizationData');
        //preClosureLoan.lastchangeuser = authData.userid;
        $http.post(serviceBase + 'api/EMI/PayLoan?sLoanId=' + loanid + '&sNo=' + emino).success(function (response) {

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

    paymentLoanServiceFactory.BindDueDate = _bindDueDate;
    paymentLoanServiceFactory.LoanRepayment = _loanRepayment;

    return paymentLoanServiceFactory;
} ]);

