module.exports = function(){
  var conn = require('../../config/mysql/db')();

  //  application level route -> route level middleware
  var route = require('express').Router();
  route.get('/add', function(req, res){
    var sql = 'SELECT id, title FROM topic';
    conn.query(sql, function(err, topics, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      res.render('topic/add', {topics: topics, user: req.user});
    });
  });

  route.post('/add', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;

    var sql = 'INSERT INTO topic(title, description, author) VALUES(?, ?, ?)';
    conn.query(sql, [title, description, author], function(err, result, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        // res.send(result); //debugging
        res.redirect('/topic/'+result.insertId);
      }
    });
  });

  route.get(['/:id/edit'], function(req, res){
    var sql = 'SELECT id, title FROM topic';
    conn.query(sql, function(err, topics, fields){  //rows -> topics
      var id = req.params.id;
      if(id){
        var sql = 'SELECT * FROM topic WHERE id=?';
        conn.query(sql, [id], function(err, topic, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          }else{
            //현재 선택한 topic에 대한 세부정보를 topic 변수로 전달.
            res.render('topic/edit', {topics:topics, topic:topic[0], user: req.user});
          }
        });
      }else{
        console.log('There is NO id.');
        res.status(500).send('Internal Server Error');
      }
    }); //end of query
  });

  route.post(['/:id/edit'], function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var id = req.params.id;
    var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
    var params = [title, description, author, id];
    conn.query(sql, params, function(err, topics, fields){  //rows -> topics
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{
        res.redirect('/topic/' + id);
      }
    });
  });

  route.get(['/:id/delete'], function(req, res){
    var sql = 'SELECT id, title FROM topic';
    conn.query(sql, function(err, topics, fields){  //rows -> topics
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      var sql = 'SELECT * FROM topic WHERE id=?';
      var id = req.params.id;
      conn.query(sql, [id], function(err, topic, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        else{
          if(topic.length <= 0){
            console.log('There is NO record.');
            res.status(500).send('Internal Server Error');
          }
          else{
            res.render('topic/delete', {topics: topics, topic: topic[0], user: req.user});
          }
        }
      });
    });
  });

  route.post(['/:id/delete'], function(req, res){
    var sql = 'DELETE FROM topic WHERE id=?';
    var id = req.params.id;
    conn.query(sql, [id], function(err, result, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      res.redirect('/topic');  // return back to home page.
    });
  });

  route.get(['/', '/:id'], function(req, res){
    console.log('req.user :', req.user);
    var sql = 'SELECT id, title FROM topic';
    conn.query(sql, function(err, topics, fields){  //rows -> topics
      var id = req.params.id;
      if(id){
        var sql = 'SELECT * FROM topic WHERE id=?';
        conn.query(sql, [id], function(err, topic, fields){
          //만약 rows가 없다면 -> 없는 url id 에 접근하는 경우...
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          }else{
            //현재 선택한 topic에 대한 세부정보를 topic 변수로 전달해보자.
            res.render('topic/view', {topics:topics, topic:topic[0], user: req.user});
          }
        });
      }else{  //id 가 없는 경우 - home url
        res.render('topic/view', {topics:topics, user: req.user});  //view template file rendering
      }

    }); //end of query
  });

  return route;
};
