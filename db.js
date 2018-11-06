var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({
    defaultLayout:'main',
    helpers: {
        selected: function(a) {
            if (a == leagueId) { return 'selected="selected"'; }
            return '';
        }
    }
});
var bodyParser = require('body-parser');
var mysql = require('./connection.js')
const path = require('path');
var leagueId = 1;
const publicPath = path.join(__dirname, '/public');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(publicPath));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8670);


app.get('/home',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?',[leagueId], function(err, rows, fields){
    if(err){
        res.write(JSON.stringify(err));
        return;
    }
    context.team = rows;
    mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        context.options = newrows;
        res.render('home', context);
    })
  })
});

app.post('/home',function(req,res){
    var context = {};
    leagueId = req.body.League;
    mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?',[leagueId], function(err, rows, fields){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        context.team = rows;
        mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
            if(err){
                res.write(JSON.stringify(err));
                return;
            }
            context.options = newrows;
            res.render('home', context);
        })
    })
})


app.get('/createSchedule',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT startDate, endDate FROM schedule', function(err, rows, fields){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        context.rows = rows;
        mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?',[leagueId], function(err, rows, fields){
            if(err){
                res.write(JSON.stringify(err));
                return;
            }
            context.team = rows;
            mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.options = newrows;
                res.render('createSchedule', context);
            })
        })
    })
});

app.post('/createSchedule',function(req,res){
    var context = {};
    mysql.pool.query('INSERT INTO `schedule` (startDate, endDate) VALUES (?, ?)',[req.body.startDate, req.body.endDate], function(err,result){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        mysql.pool.query('SELECT startDate, endDate FROM schedule', function(err, rows, fields){
            if(err){
                res.write(JSON.stringify(err));
                return;
            }
            context.rows = rows;
            mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?',[leagueId], function(err, rows, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.team = rows;
                mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
                    if(err){
                        res.write(JSON.stringify(err));
                        return;
                    }
                    context.options = newrows;
                    res.render('createSchedule', context);
                })
            })
        })
    })
})

app.get('/createLeague',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?',[leagueId], function(err, rows, fields){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        context.team = rows;
        mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
            if(err){
                res.write(JSON.stringify(err));
                return;
            }
            context.options = newrows;
            res.render('createLeague', context);
        })
    })
});

app.post('/createLeague',function(req,res){
    var context = {};
    mysql.pool.query('INSERT INTO `leagues`(name,FGM,FGA,FTM,FTA,points,assists,rebounds,steals,blocks,turnovers) VALUES (?,?,?,?,?,?,?,?,?,?,?);',[req.body.name, req.body.FGM, req.body.FGA, req.body.FTM, req.body.FTA, req.body.Points, req.body.Assists, req.body.Rebounds, req.body.Steals, req.body.Blocks, req.body.Turnovers], function(err,result){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        context.status = 'League Created'
        mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?',[leagueId], function(err, rows, fields){
            if(err){
                res.write(JSON.stringify(err));
                return;
            }
            context.team = rows;
            mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.options = newrows;
                res.render('createLeague', context);
            })
        })
    })
})

app.get('/createPlayer',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?',[leagueId], function(err, rows, fields){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        context.team = rows;
        mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
            if(err){
                res.write(JSON.stringify(err));
                return;
            }
            context.options = newrows;
            res.render('createPlayer', context);
        })
    })
});

app.post('/createPlayer',function(req,res){
    var context = {};
    mysql.pool.query('INSERT INTO `players`(fName,lName,basketballTeam,position) VALUES (?,?,?,?);',[req.body.fName, req.body.lName, req.body.team, req.body.Position], function(err,result){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        context.status = 'Player Created'
        mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?',[leagueId], function(err, rows, fields){
            if(err){
                res.write(JSON.stringify(err));
                return;
            }
            context.team = rows;
            mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.options = newrows;
                res.render('createPlayer', context);
            })
        })
    })
})

app.get('/createPerformance',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT id, fName, lname, basketballTeam FROM players', function(err, rows, fields){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        context.player = rows;
        mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?',[leagueId], function(err, rows, fields){
            if(err){
                res.write(JSON.stringify(err));
                return;
            }
            context.team = rows;
            mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.options = newrows;
                res.render('createPerformance', context);
            })
        })
    })
});

app.post('/createPerformance',function(req,res){
    var context = {};
    mysql.pool.query('SELECT id, fName, lname, basketballTeam FROM players', function(err, rows, fields){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        context.player = rows;
        mysql.pool.query('INSERT INTO `performances`(playerId,date,FGM,FGA,FTM,FTA,points,assists,rebounds,steals,blocks,turnovers) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);',[req.body.player, req.body.performanceDate, req.body.FGM, req.body.FGA, req.body.FTM, req.body.FTA, req.body.Points, req.body.Assists, req.body.Rebounds, req.body.Steals, req.body.Blocks, req.body.Turnovers], function(err, result){
            if(err){
                res.write(JSON.stringify(err));
                return;
            }
            context.status = 'Performance Created'
            mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?',[leagueId], function(err, rows, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.team = rows;
                mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
                    if(err){
                        res.write(JSON.stringify(err));
                        return;
                    }
                    context.options = newrows;
                    res.render('createPerformance', context);
                })
            })
        })
    })
})

app.get('/createTeam',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT name FROM leagues WHERE id = ?',[leagueId], function(err, rows, fields){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        context.league = rows;
        mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?;',[leagueId], function(err, newrows, newfields){
            if(err){
                res.write(JSON.stringify(err));
                return;
            }
            context.team = newrows;
            mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?',[leagueId], function(err, rows, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.team = rows;
                mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
                    if(err){
                        res.write(JSON.stringify(err));
                        return;
                    }
                    context.options = newrows;
                    res.render('createTeam', context);
                })
            })
        })
    })
});

app.post('/createTeam',function(req,res){
    var context = {};
    mysql.pool.query('SELECT name FROM leagues WHERE id = ?',[leagueId], function(err, rows, fields){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        context.league = rows;
        mysql.pool.query('INSERT INTO `teams`(fantasyTeamName,abbreviation,leagueId) VALUES (?,?,?);',[req.body.teamName, req.body.abbreviation, leagueId], function(err, result){
            if(err){
                res.write(JSON.stringify(err));
                return;
            }
            mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?;',[leagueId], function(err, newrows, newfields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.team = newrows;
                mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?',[leagueId], function(err, rows, fields){
                    if(err){
                        res.write(JSON.stringify(err));
                        return;
                    }
                    context.team = rows;
                    mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
                        if(err){
                            res.write(JSON.stringify(err));
                            return;
                        }
                        context.options = newrows;
                        res.render('createTeam', context);
                    })
                })
            })
        })
    })
})

app.get('/createMatchup',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT weekId, startDate, endDate FROM schedule', function(err, rows, fields){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        context.week = rows;
        mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?;',[leagueId], function(err, newrows, newfields){
            if(err){
                res.write(JSON.stringify(err));
                return;
            }
            context.team = newrows;
            mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?',[leagueId], function(err, rows, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.team = rows;
                mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
                    if(err){
                        res.write(JSON.stringify(err));
                        return;
                    }
                    context.options = newrows;
                    res.render('createMatchup', context);
                })
            })
        })
    })
});

app.post('/createMatchup',function(req,res){
    var context = {};
    mysql.pool.query('SELECT weekId, startDate, endDate FROM schedule', function(err, rows, fields){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        context.week = rows;
        mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?;',[leagueId], function(err, newrows, newfields){
            if(err){
                res.write(JSON.stringify(err));
                return;
            }
            context.team = newrows;
            mysql.pool.query('INSERT INTO `matchups`(homeTeam,awayTeam,week) VALUES (?,?,?);',[req.body.homeTeam, req.body.awayTeam, req.body.Week], function(err, result){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.status = 'Matchup Created';
                mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?',[leagueId], function(err, rows, fields){
                    if(err){
                        res.write(JSON.stringify(err));
                        return;
                    }
                    context.team = rows;
                    mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
                        if(err){
                            res.write(JSON.stringify(err));
                            return;
                        }
                        context.options = newrows;
                        res.render('createMatchup', context);
                    })
                })
            })
        })
    })
})

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});