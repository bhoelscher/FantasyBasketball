CREATE TABLE `leagues` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `FGM` numeric(8,2) DEFAULT 0,
  `FGA` numeric(8,2) DEFAULT 0,
  `FTM` numeric(8,2) DEFAULT 0,
  `FTA` numeric(8,2) DEFAULT 0,
  `points` numeric(8,2) DEFAULT 0,
  `assists` numeric(8,2) DEFAULT 0,
  `rebounds` numeric(8,2) DEFAULT 0,
  `steals` numeric(8,2) DEFAULT 0,
  `blocks` numeric(8,2) DEFAULT 0,
  `turnovers` numeric(8,2) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE `teams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fantasyTeamName` varchar(255) NOT NULL,
  `abbreviation` varchar(255) NOT NULL,
  `leagueId` int(11),
  PRIMARY KEY (`id`),
  CONSTRAINT `teams_fk_1` FOREIGN KEY (`leagueId`) REFERENCES `leagues` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE `players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fName` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  `basketballTeam` varchar(255) DEFAULT NULL,
  `position` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE `teams_to_players` (
  `teamId` int(11) NOT NULL,
  `playerId` int(11) NOT NULL,
  PRIMARY KEY(`teamId`,`playerId`),
  CONSTRAINT `teams_to_players_fk_1` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`),
  CONSTRAINT `teams_to_players_fk_2` FOREIGN KEY (`playerId`) REFERENCES `players` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;


CREATE TABLE `schedule` (
  `weekId` int(11) NOT NULL AUTO_INCREMENT,
  `startDate` DATE NOT NULL,
  `endDate` DATE NOT NULL,
  PRIMARY KEY (`weekId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE `matchups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `homeTeam` int(11),
  `awayTeam` int(11),
  `week` int(11),
  PRIMARY KEY (`id`),
  CONSTRAINT `matchups_fk_1` FOREIGN KEY (`homeTeam`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `matchups_fk_2` FOREIGN KEY (`awayTeam`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `matchups_fk_3` FOREIGN KEY (`week`) REFERENCES `schedule` (`weekId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE `performances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playerId` int(11),
  `date` DATE DEFAULT NULL,
  `FGM` int(11) DEFAULT NULL,
  `FGA` int(11) DEFAULT NULL,
  `FTM` int(11) DEFAULT NULL,
  `FTA` int(11) DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  `assists` int(11) DEFAULT NULL,
  `rebounds` int(11) DEFAULT NULL,
  `steals` int(11) DEFAULT NULL,
  `blocks` int(11) DEFAULT NULL,
  `turnovers` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `performances_fk_1` FOREIGN KEY (`playerId`) REFERENCES `players` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

LOCK TABLES `leagues` WRITE;
INSERT INTO `leagues`(name,FGM,FGA,FTM,FTA,points,assists,rebounds,steals,blocks,turnovers) VALUES ('League of Champions and Losers',0.5,-0.5,1,-1,1,1,1,2,2,-1),('Second League',0,0,0,0,1,0,0,0,0,0);
UNLOCK TABLES;

LOCK TABLES `teams` WRITE;
INSERT INTO `teams`(fantasyTeamName,abbreviation,leagueId) VALUES ('Team 1','T1',1),('Team 2','T2',1),('Team 3','T3',1),('Team 4','T4',1),('Crepes of Wrath','WRTH',2),('The Ginger Express','GING',2);
UNLOCK TABLES;

LOCK TABLES `players` WRITE;
INSERT INTO `players`(fName,lName,basketballTeam,position) 
VALUES ('Lebron','James','Los Angeles Lakers','SF'),
('Kevin','Love','Cleveland Cavaliers','C'),
('Nerlens','Noel','Philadelphia 76ers','C'),
('James','Harden','Houston Rockets','SG'),
('Steph','Curry','Golden State Warriors','PG'),
('Giannis','Antetekounmpo','Milwaukee Bucks','PF'),
('Kevin','Durant','Golden State Warriors','SF'),
('Chris','Paul','Houston Rockets','PG');
UNLOCK TABLES;

LOCK TABLES `teams_to_players` WRITE;
INSERT INTO `teams_to_players` (teamId,playerId) VALUES (1,1),(1,2),(2,3),(2,4),(3,5),(3,6),(4,7),(4,8),(5,1),(5,6),(6,4),(6,5);
UNLOCK TABLES;

LOCK TABLES `schedule` WRITE;
INSERT INTO `schedule`(startDate, endDate) VALUES ('2018-10-15','2018-10-21'),('2018-10-22','2018-10-28'),('2018-10-29','2018-11-04'),('2018-11-05','2018-11-11'),('2018-11-12','2018-11-18');
UNLOCK TABLES;

LOCK TABLES `matchups` WRITE;
INSERT INTO `matchups`(homeTeam,awayTeam,week) VALUES (1,2,1),(3,4,1),(5,6,1),(4,1,2),(2,3,2),(6,5,2),(3,1,3),(4,2,3);
UNLOCK TABLES;

LOCK TABLES `performances` WRITE;
INSERT INTO `performances`(playerId,date,FGM,FGA,FTM,FTA,points,assists,rebounds,steals,blocks,turnovers) 
VALUES (1,'2018-10-16',2,2,3,3,7,2,5,0,0,2),
(2,'2018-10-16',2,3,3,4,7,5,12,2,0,3),
(3,'2018-10-16',5,7,3,3,13,1,8,0,2,1),
(4,'2018-10-16',3,3,8,10,14,4,3,1,0,2),
(5,'2018-10-16',5,8,4,4,19,6,2,3,0,4),
(6,'2018-10-16',4,6,2,2,11,8,8,2,2,2),
(7,'2018-10-16',2,2,3,3,9,2,3,1,0,2),
(8,'2018-10-16',3,7,3,3,10,11,3,5,0,3),
(1,'2018-10-23',2,2,3,3,7,2,5,0,0,3),
(2,'2018-10-23',2,3,3,4,7,5,12,2,0,4),
(3,'2018-10-23',5,7,3,3,13,1,8,0,2,2),
(4,'2018-10-23',3,3,8,10,14,4,3,1,0,3),
(5,'2018-10-23',5,8,4,4,19,6,2,3,0,5),
(6,'2018-10-23',4,6,2,2,11,8,8,2,2,3),
(7,'2018-10-23',2,2,3,3,9,2,3,1,0,3),
(8,'2018-10-23',3,7,3,3,10,11,3,5,0,4),
(1,'2018-10-30',2,2,3,3,7,2,5,0,0,3),
(2,'2018-10-30',2,3,3,4,7,5,12,2,0,4),
(3,'2018-10-30',5,7,3,3,13,1,8,0,2,2),
(4,'2018-10-30',3,3,8,10,14,4,3,1,0,3),
(5,'2018-10-30',5,8,4,4,19,6,2,3,0,5),
(6,'2018-10-30',4,6,2,2,11,8,8,2,2,3),
(7,'2018-10-30',2,2,3,3,9,2,3,1,0,3),
(8,'2018-10-30',3,7,3,3,10,11,3,5,0,4);
UNLOCK TABLES;

CREATE VIEW v_home_scores as
select matchups.id as matchupId, SUM((p.FGM*s.FGM + p.FGA*s.FGA + p.FTM*s.FTM + p.FTA*s.FTA + p.points*s.points + p.assists*s.assists + p.rebounds*s.rebounds + p.steals*s.steals + p.blocks*s.blocks + p.turnovers*s.turnovers)) as FantasyPoints
from performances p
inner join players on p.playerId = players.id
inner join teams_to_players ttp on players.id = ttp.playerId
inner join matchups on ttp.teamId = matchups.homeTeam
inner join teams on matchups.homeTeam = teams.id
inner join schedule on matchups.week = schedule.weekId
inner join leagues s on s.id = teams.leagueId
where p.date <= schedule.endDate
and p.date >= schedule.startDate
group by matchups.id

CREATE VIEW v_away_scores as
select matchups.id as matchupId, SUM((p.FGM*s.FGM + p.FGA*s.FGA + p.FTM*s.FTM + p.FTA*s.FTA + p.points*s.points + p.assists*s.assists + p.rebounds*s.rebounds + p.steals*s.steals + p.blocks*s.blocks + p.turnovers*s.turnovers)) as FantasyPoints
from performances p
inner join players on p.playerId = players.id
inner join teams_to_players ttp on players.id = ttp.playerId
inner join matchups on ttp.teamId = matchups.awayTeam
inner join teams on matchups.awayTeam = teams.id
inner join schedule on matchups.week = schedule.weekId
inner join leagues s on s.id = teams.leagueId
where p.date <= schedule.endDate
and p.date >= schedule.startDate
group by matchups.id


CREATE VIEW v_matchup_scores as 
select matchups.id,
    schedule.endDate,
    matchups.homeTeam,
    matchups.awayTeam,
    COALESCE(v_home_scores.FantasyPoints, 0) as homeTeamPoints,
    COALESCE(v_away_scores.FantasyPoints, 0) as awayTeamPoints
from matchups
inner join schedule on matchups.week = schedule.weekId
left outer join v_home_scores on matchups.id = v_home_scores.matchupId
left outer join v_away_scores on matchups.id = v_away_scores.matchupId

