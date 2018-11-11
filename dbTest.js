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
app.set('port', 8671);


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
        context.status = 'Schedule Created'
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
        mysql.pool.query('SELECT id, name, FGM, FGA, FTM, FTA, points, assists, rebounds, steals, blocks, turnovers FROM leagues', function(err, newrows, newfields){
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
            mysql.pool.query('SELECT id, name, FGM, FGA, FTM, FTA, points, assists, rebounds, steals, blocks, turnovers FROM leagues', function(err, newrows, newfields){
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
            mysql.pool.query('SELECT fName, lname, basketballTeam, position FROM players', function(err, rows, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.player = rows;
                res.render('createPlayer', context);
            })
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
                mysql.pool.query('SELECT fName, lname, basketballTeam, position FROM players', function(err, rows, fields){
                    if(err){
                        res.write(JSON.stringify(err));
                        return;
                    }
                    context.player = rows;
                    res.render('createPlayer', context);
                })
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
                mysql.pool.query('SELECT playerId, date, FGM, FGA, FTM, FTA, points, assists, rebounds, steals, blocks, turnovers FROM performances', function(err, rows, fields){
                    if(err){
                        res.write(JSON.stringify(err));
                        return;
                    }
                    context.performance = rows;
                    res.render('createPerformance', context);
                })
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
                    mysql.pool.query('SELECT playerId, date, FGM, FGA, FTM, FTA, points, assists, rebounds, steals, blocks, turnovers FROM performances', function(err, rows, fields){
                        if(err){
                            res.write(JSON.stringify(err));
                            return;
                        }
                        context.performance = rows;
                        res.render('createPerformance', context);
                    })
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
            context.status = 'Team Created'
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
            mysql.pool.query('SELECT m.homeTeam, m.awayTeam, m.week FROM matchups m INNER JOIN teams t on m.hometeam = t.id WHERE t.leagueId = ?;',[leagueId], function(err, rows, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.matchup = rows;
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
                mysql.pool.query('SELECT m.homeTeam, m.awayTeam, m.week FROM matchups m INNER JOIN teams t on m.hometeam = t.id WHERE t.leagueId = ?;',[leagueId], function(err, rows, fields){
                    if(err){
                        res.write(JSON.stringify(err));
                        return;
                    }
                    context.matchup = rows;
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

app.get('/schedule',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE leagueId = ?;',[leagueId], function(err, newrows, newfields){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        context.team = newrows;
        mysql.pool.query('SELECT t.fantasyTeamName as homeTeam, t2.fantasyTeamName as awayTeam, m.week, v.homeTeamPoints, v.awayTeamPoints FROM matchups m INNER JOIN teams t ON m.hometeam = t.id INNER JOIN teams t2 ON m.awayTeam = t2.id INNER JOIN v_matchup_scores v ON v.id = m.id WHERE t.leagueId = ? ORDER BY m.week;',[leagueId], function(err, rows, fields){
            if(err){
                res.write(JSON.stringify(err));
                return;
            }
            context.matchup = rows;
            mysql.pool.query('SELECT id, name FROM leagues', function(err, newrows, newfields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.options = newrows;
                res.render('schedule', context);
            })
        })
    })
});

app.get('/viewTeam',function(req,res,next){
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
            mysql.pool.query('SELECT DISTINCT players.id, players.fName, players.lname, players.basketballTeam, players.position, avg.FGM, avg.FGA, avg.FTM, avg.FTA, avg.points, avg.assists, avg.rebounds, avg.steals, avg.blocks, avg.turnovers, (avg.FGM*l.FGM + avg.FGA*l.FGA + avg.FTM*l.FTM + avg.FTA*l.FTA + avg.points*l.points + avg.assists*l.assists + avg.rebounds*l.rebounds + avg.steals*l.steals + avg.blocks*l.blocks + avg.turnovers*l.turnovers) as FantasyPoints FROM teams_to_players ttp  INNER JOIN teams t ON ttp.teamId = t.id RIGHT OUTER JOIN players ON ttp.playerId = players.id left outer join v_average_performances avg on players.id = avg.playerId inner join leagues l on l.id = ? WHERE t.id = ?;',[leagueId, req.query.teamId], function(err, rows, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.player = rows;
                mysql.pool.query('SELECT id, fantasyTeamName, abbreviation FROM teams WHERE id = ?', [req.query.teamId], function(err, rows, fields){
                    if(err){
                        res.write(JSON.stringify(err));
                        return;
                    }
                    context.curTeam = rows;
                    res.render('viewTeam', context);
                })
            })
        })
    })
});

app.get('/unownedPlayers',function(req,res,next){
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
            mysql.pool.query('select distinct players.id as playerId, players.fName, players.lname, players.basketballTeam, players.position, avg.FGM, avg.FGA, avg.FTM, avg.FTA, avg.points, avg.assists, avg.rebounds, avg.steals, avg.blocks, avg.turnovers, (avg.FGM*l.FGM + avg.FGA*l.FGA + avg.FTM*l.FTM + avg.FTA*l.FTA + avg.points*l.points + avg.assists*l.assists + avg.rebounds*l.rebounds + avg.steals*l.steals + avg.blocks*l.blocks + avg.turnovers*l.turnovers) as FantasyPoints from teams_to_players ttp inner join teams t on ttp.teamId = t.id and leagueId = ? right outer join players on ttp.playerId = players.id left outer join v_average_performances avg on players.id = avg.playerId inner join leagues l on l.id = ? where t.abbreviation is NULL;',[leagueId, leagueId], function(err, rows, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.player = rows;
                res.render('unownedPlayers', context);
            })
        })
    })
});

app.post('/addPlayer',function(req,res){
    var context = {};
    mysql.pool.query('INSERT INTO `teams_to_players` (teamId,playerId) VALUES (?,?);', [req.body.Team, req.body.player], function(err, rows, fields){
        if(err){
            res.write(JSON.stringify(err));
            return;
        }
        res.redirect('/viewTeam?teamId=' + req.body.Team);
    })
})

app.get('/allPlayers',function(req,res,next){
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
            mysql.pool.query('select distinct players.id, players.fName, players.lname, players.basketballTeam, players.position, avg.FGM, avg.FGA, avg.FTM, avg.FTA, avg.points, avg.assists, avg.rebounds, avg.steals, avg.blocks, avg.turnovers, (avg.FGM*l.FGM + avg.FGA*l.FGA + avg.FTM*l.FTM + avg.FTA*l.FTA + avg.points*l.points + avg.assists*l.assists + avg.rebounds*l.rebounds + avg.steals*l.steals + avg.blocks*l.blocks + avg.turnovers*l.turnovers) as FantasyPoints, t.abbreviation, t.id as teamId from teams_to_players ttp inner join teams t on ttp.teamId = t.id and leagueId = ? right outer join players on ttp.playerId = players.id left outer join v_average_performances avg on players.id = avg.playerId inner join leagues l on l.id = ?;',[leagueId, leagueId], function(err, rows, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.player = rows;
                res.render('allPlayers', context);
            })
        })
    })
});

app.get('/standings',function(req,res,next){
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
            mysql.pool.query('select teams.id, fantasyTeamName, COALESCE(winners.wins,0) as wins, COALESCE(losers.losses, 0) as losses, COALESCE((home.homeTies + away.awayTies),0) as ties, (COALESCE(winners.wins,0) - COALESCE(losers.losses, 0)) as winsMinusLosses from teams left outer join (select teams.id as team, count(results.winner) as wins from teams inner join (select v_matchup_scores.id, v_matchup_scores.homeTeam, v_matchup_scores.awayteam,  (case when homeTeamPoints > awayTeamPoints then v_matchup_scores.homeTeam when awayTeamPoints > homeTeamPoints then v_matchup_scores.awayTeam else NULL end) as winner from v_matchup_scores where v_matchup_scores.endDate < CURDATE()) as results on teams.id = results.winner group by teams.id) as winners on winners.team = teams.id left outer join (select teams.id as team, count(results.loser) as losses from teams inner join (select v_matchup_scores.id, v_matchup_scores.homeTeam, v_matchup_scores.awayteam,  (case when homeTeamPoints > awayTeamPoints then v_matchup_scores.awayTeam when awayTeamPoints > homeTeamPoints then v_matchup_scores.homeTeam else NULL end) as loser from v_matchup_scores where v_matchup_scores.endDate < CURDATE()) as results on teams.id = results.loser group by teams.id) as losers on losers.team = teams.id left outer join (select teams.id as homeTeam, count(v_matchup_scores.id) as homeTies from teams left outer join v_matchup_scores on teams.id = v_matchup_scores.homeTeam and homeTeamPoints = awayTeamPoints and v_matchup_scores.endDate < CURDATE() group by teams.id) as home on teams.id = home.homeTeam left outer join (select teams.id as awayTeam, count(v_matchup_scores.id) as awayTies from teams left outer join v_matchup_scores on teams.id = v_matchup_scores.awayTeam and homeTeamPoints = awayTeamPoints and v_matchup_scores.endDate < CURDATE() group by teams.id) as away on teams.id = away.awayTeam where teams.leagueId = ? order by winsMinusLosses desc;',[leagueId], function(err, rows, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    return;
                }
                context.standing = rows;
                res.render('standings', context);
            })
        })
    })
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});