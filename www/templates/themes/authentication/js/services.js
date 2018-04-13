// 
appServices.factory('authService', ['$http', '$q', 'localStorage', 'ngAuthSettings', function ($http, $q, localStorage, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        useRefreshTokens: false
    };

    var _externalAuthData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };


    var _login = function (loginData) {

        //var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
          var data = {

            "UserName": loginData.userName,
            "Password": loginData.password,
            "RememberMe": true,
            "IsSessionExpired": true
        }


        if (loginData.useRefreshTokens) {
            //data = data + "&client_id=" + ngAuthSettings.clientId;
        }

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/Account/Login', data).success(function (response) {

            if (loginData.useRefreshTokens) {
                localStorage.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
            }
            else {
                localStorage.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
            }
            _authentication.isAuth = true;
            _authentication.userName = loginData.userName;
            _authentication.useRefreshTokens = loginData.useRefreshTokens;

            deferred.resolve(response);

        }).error(function (err, status) {
            //_logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _logOut = function () {


        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');
        
        
        $http.post(serviceBase + 'api/Account/Logout?sUserId='+ authData.userid ).success(function (response) {

            localStorage.removeAll('authorizationData');

            _authentication.isAuth = false;
            _authentication.userName = "";
            _authentication.useRefreshTokens = false;
        
            
            deferred.resolve(response);

        }).error(function (err, status) {
            deferred.reject(err);
        });

        
        
        return deferred.promise;



    };


    var _fillAuthData = function () {

        var authData = localStorage.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
            _authentication.useRefreshTokens = authData.useRefreshTokens;
        }

    };

    var _refreshToken = function () {
        var deferred = $q.defer();

        var authData = localStorage.get('authorizationData');

        if (authData) {

            if (authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                localStorage.remove('authorizationData');

                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    localStorage.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

                    deferred.resolve(response);

                }).error(function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });
            }
        }

        return deferred.promise;
    };

    var _obtainAccessToken = function (externalData) {

        var deferred = $q.defer();

        $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

            localStorage.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

            _authentication.isAuth = true;
            _authentication.userName = response.userName;
            _authentication.useRefreshTokens = false;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

   

    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;

    authServiceFactory.obtainAccessToken = _obtainAccessToken;
    authServiceFactory.externalAuthData = _externalAuthData;

    return authServiceFactory;
}]);