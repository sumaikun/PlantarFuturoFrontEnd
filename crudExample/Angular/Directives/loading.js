app.directive('loading', function () {
    return {
      restrict: 'E',
      replace:true,
      template: '<div class="loading"><img src="http://www.nasa.gov/multimedia/videogallery/ajax-loader.gif"/>LOADING...</div>',
      link: function (scope, element, attr) {
          scope.$watch('loading', function (val) {
              console.log(val);
              if (val)
                  $(element).show();
              else
                  $(element).hide();
        });
      }
    }
});



