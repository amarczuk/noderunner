angular.module('app', ['mm.foundation']).controller(
  'noderunnerAppController', 
  [ '$scope',
    '$document',
    '$rootScope',
    '$timeout',
    function($scope, $document, $rootScope, $timeout) {
      $scope.routes = [];
      $scope.loading = false;
      $scope.code = 'var words = ["hello", "world!"];\nreturn words.join(" ");\n';
      $scope.result = '';

      var editors = [];

      $scope.run = function() {
        $scope.loading = true;
        $scope.result = 'running your code...';
        phresto.post('noderunner/run', {code: editors['code'].getValue()})
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

      var setEditor = function(name, mode, isReadOnly) {
          editors[name] = ace.edit(name);
          editors[name].setTheme("ace/theme/monokai");
          editors[name].getSession().setMode(mode);
          if (isReadOnly) {
            editors[name].setReadOnly(true);
          }
      }

      angular.element(document).ready(function () {
        $timeout(function() {
          $document.foundation();

          setEditor("code", "ace/mode/javascript");
          setEditor("webtask_code", "ace/mode/javascript", true);
          setEditor("controller_code", "ace/mode/php", true);
        }, 500);
      });
    }
  ]);
