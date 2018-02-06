var inquire = require('inquirer');

inquire
    .prompt([
        {
            type: "confirm",
            message: "Do you want to see my last 20 Tweets?",
            name: "tweets",
            default: true
        }
    ])
    .then(function(usr){
        if(usr.tweets === true){
            console.log("True");
        }else {
            console.log('false')
        }
    });