
//var serviceBase = 'http://localhost:50000/FMWebService/';
//var serviceBase = 'https://www.psenergy.com/FMWebService/';
var serviceBase = 'http://www.csfinance.in/loanservice/';
//var serviceBase = 'http://www.csfinance.in/demoservice/';

//This is Controller for Dialog box.
appControllers.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});