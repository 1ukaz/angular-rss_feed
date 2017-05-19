var App = angular.module('RssApp', ['ngRoute']);

angular.module('RssApp').filter('datetime', function($filter) {
    return function(input) {
        if(input == null) { return ""; }
        var _date = $filter('date')(new Date(input), 'dd/MM/yyyy - HH:mm');
        return _date.toUpperCase();
    };
});

App.filter('trustedContent', ['$sce', function($sce) {
    return function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
}]);

App.config(function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'feed.html', reloadOnSearch: false});
});

App.controller('show_feed',['$scope','FeedService', function ($rootScope, Feed) {
    $rootScope.isArray = angular.isArray;
	$rootScope.update_feed = function() {
        Feed.parseFeed('http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml').then(
            function(res) {
                if (res.status == "200") {
                    $rootScope.data_logo =  res.data.query.results.rss.channel.image;
                    $rootScope.data_feed = res.data.query.results.rss.channel.item;
                } else {
                    $rootScope.data_logo = null;
                    $rootScope.datos_feed = [];
                }
            }
        );
	};
	$rootScope.update_feed();
}]);

App.factory('FeedService', ['$http', function($http) {
    return {
        parseFeed : function(url) {
            return $http.jsonp('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D\'' + encodeURIComponent(url) + '\'&format=json&callback=JSON_CALLBACK');
        }
    }
}]);
