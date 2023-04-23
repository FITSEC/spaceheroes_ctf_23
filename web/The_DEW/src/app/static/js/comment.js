$(document).ready(function() {
  var socket = io.connect('http://' + document.domain + ':' + location.port);
  socket.on('connect', function() {
    console.log('Connected to server');
  });

  socket.on('refresh feed', function() {
    // Append new comment to existing comments
    window.location.reload();
  });

  $('#comment-form').submit(function(e) {
    e.preventDefault();
    var author = $('#comment-author').val();
    var comment = $('#comment-input').val();
    socket.emit('submit comment', {author: author, comment: comment});
    $('#comment-author').val('');
    $('#comment-input').val('');
  });

  document.getElementById('refresh').onclick = function(){
    window.location.reload();
  }

  document.getElementById('waive').onclick = function(){
    socket.emit('waive admin');
  }
});
