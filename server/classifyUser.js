//1 is yes, 2 is no

var array = [1, 2, 2, undefined, undefined, 2, 2, 1, 2, 1 , 1, 1, 2, 2, 2, 2, 1, 1, 1];

// 8 positive
// 2 undefined
// 9 negative

//days of attempts at goal from database (current date - start date)
var days = 5;


var gradeUser = function(array) {
  //grab shortened array
  var daysOnGoal = array.slice(0, days).sort();
  console.log( "sorted responses:  ", daysOnGoal );

  // loop through our daysOnGoal array and count up the 2's
  var count = 0;
  for ( var i = 0; i < daysOnGoal.length; i++ ) {
    if( daysOnGoal[i] === 2  || daysOnGoal[i] === null ) {
      count = count += 1;
    }
    var count = count;
  }
  //calculate the percentage grade/days
  var percentage = (count / days) * 100;
  console.log(percentage);
  //if( percentage < 30) {
      //use array A, use harrasment frequency A
    //}
    //else if (percentage > 30 && percentage < 60 ) {
    //   use array B
    // }
    // else if (percentage > 60) {
    //   use array C
    // }
};
//console.log("count outside the for loop: ", count);

gradeUser(array);
