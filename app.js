var module = angular
        .module('animateApp', [])
        .directive('ball', function ($timeout) {
            return {
                restrict:'E',
                link:function (scope, element, attrs) {
                    element.addClass('circle');

                    scope.$watch(attrs.x, function (x) {
                        element.css('left', x + 'px');
                    });
                    scope.$watch(attrs.y, function (y) {
                        element.css('top', y + 'px');
                    });
                    scope.$watch(attrs.color, function (color) {
                        element.css('backgroundColor', color);
                    });
                }
            };
        })
       .factory('animate', function($window, $rootScope) {
          var requestAnimationFrame = $window.requestAnimationFrame ||
               $window.mozRequestAnimationFrame ||
               $window.msRequestAnimationFrame ||
               $window.webkitRequestAnimationFrame;
           
          
           return function(tick) {
               requestAnimationFrame(function() {
                   $rootScope.$apply(tick);
               });
           };
       });

function animator(scope, animate) {
    (function tick() {
        var i;
        var now = new Date().getTime();
      
        scope.timestamps.push(now);
      if (scope.timestamps.length > scope.timestampsToUse) {
       scope.timestamps.shift(); 
      }
        var maxX = 600;
        var maxY = 600;

        for (i = 0; i < scope.shapes.length; i++) {
            var shape = scope.shapes[i];
            var elapsed = (shape.timestamp || now) - now;

            shape.timestamp = now;
            shape.x += elapsed * shape.velX / 1000;
            shape.y += elapsed * shape.velY / 1000;

            if (shape.x > maxX) {
                shape.x = 2 * maxX - shape.x;
                shape.velX *= -1;
            }
            if (shape.x < 30) {
                shape.x = 30;
                shape.velX *= -1;
            }

            if (shape.y > maxY) {
                shape.y = 2 * maxY - shape.y;
                shape.velY *= -1;
            }
            if (shape.y < 20) {
                shape.y = 20;
                shape.velY *= -1;
            }
        }

        animate(tick);
    })();
}

function AnimateCtrl($scope, animate) {

    function buildShape() {
        var maxVelocity = 200;
        return {
            color:'#' + (Math.random() * 0xFFFFFF << 0).toString(16),
            x:Math.min(380, Math.max(20, (Math.random() * 380))),
            y:Math.min(180, Math.max(20, (Math.random() * 180))),

            velX:(Math.random() * maxVelocity),
            velY:(Math.random() * maxVelocity)
        };
    }

    // Publish list of shapes on the $scope/presentationModel
    // Then populate the list with 100 shapes randomized in position
    // and color
    var shapeCount = 500;
    $scope.shapes = [];
    for (i = 0; i < shapeCount; i++) {
        $scope.shapes.push(buildShape());
    }
  
  $scope.timestamps = [];
  $scope.timestampsToUse = 100;
  
  $scope.fps = function() {
    var result;
    if ($scope.timestamps.length >= $scope.timestampsToUse) {
      var now = $scope.timestamps[$scope.timestampsToUse - 1];
      var then = $scope.timestamps[0];
      
      var diff = now - then;
      
      result = 1000 / (diff / $scope.timestampsToUse);
    } else {
      result = "n.a.";
    }
    
    return result;
  };

    // Start animation
    animator($scope, animate);
}
