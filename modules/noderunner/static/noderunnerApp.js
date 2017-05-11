angular.module('app', ['mm.foundation']).controller(
  'noderunnerAppController', 
  [ '$scope',
    '$document',
    '$rootScope',
    '$timeout',
    function($scope, $document, $rootScope, $timeout) {
      $scope.routes = [];
      $scope.loading = false;
      $scope.code = 'return "hello world!";\n';
      $scope.result = '';

      var editor = null;

      $scope.run = function() {
        $scope.loading = true;
        $scope.result = 'running your code...';
        phresto.post('noderunner/run', {code: editor.getValue()})
          .then(function(out) {
            $scope.$apply(function() {
              $scope.result = out.result;
              $scope.loading = false;
            });
          })
          .catch(function(err) {
            var message = err.message.message || err.message;
            $rootScope.$emit('addmessage', {type: 'alert', message: err.message.message});
            $scope.$apply(function() { 
              $scope.loading = false;
              $scope.result = 'code execution failed';
            });
          });
      }

      angular.element(document).ready(function () {
        $timeout(function() {
          $document.foundation();

          editor = ace.edit("code");
          editor.setTheme("ace/theme/monokai");
          editor.getSession().setMode("ace/mode/javascript");
        }, 500);
      });
    }
  ]);

angular.module('app').filter('prettyJSON', function () {
    function prettyPrintJson(json) {

      if (typeof json != 'object') return json;

      return JSON.stringify(json, null, '  ');
    }
    return prettyPrintJson;
});
