var ui = require("./ui.js");
var React = require("react-tools").React;

React.renderComponent(ui.Board(),
                      document.getElementById('content'));
