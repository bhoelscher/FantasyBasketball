-- View Leagues
select id, name
from leagues;

-- View league Scoring system
select id, name, FGM, FGA, FTM, FTA, points, assists, rebounds, steals, blocks, turnovers
from leagues
where id = :leagueIdInput;

-- View Teams

select id, fantasyTeamName, abbreviation
from teams
where leagueId = :leagueIdInput;

-- View Standings

select fantasyTeamName, COALESCE(winners.wins,0) as wins, COALESCE(losers.losses, 0) as losses, COALESCE((home.homeTies + away.awayTies),0) as ties, (COALESCE(winners.wins,0) - COALESCE(losers.losses, 0)) as winsMinusLosses
from teams
left outer join (select teams.id as team, count(results.winner) as wins
    from teams
    inner join (select v_matchup_scores.id, v_matchup_scores.homeTeam, v_matchup_scores.awayteam, 
        (case when homeTeamPoints > awayTeamPoints then v_matchup_scores.homeTeam
        when awayTeamPoints > homeTeamPoints then v_matchup_scores.awayTeam
        else NULL
        end) as winner
        from v_matchup_scores
        where v_matchup_scores.endDate < CURDATE()) as results on teams.id = results.winner
    group by teams.id) as winners on winners.team = teams.id
left outer join (select teams.id as team, count(results.loser) as losses
    from teams
    inner join (select v_matchup_scores.id, v_matchup_scores.homeTeam, v_matchup_scores.awayteam, 
        (case when homeTeamPoints > awayTeamPoints then v_matchup_scores.awayTeam
        when awayTeamPoints > homeTeamPoints then v_matchup_scores.homeTeam
        else NULL
        end) as loser
        from v_matchup_scores
        where v_matchup_scores.endDate < CURDATE()) as results on teams.id = results.loser
    group by teams.id) as losers on losers.team = teams.id
left outer join (select teams.id as homeTeam, count(v_matchup_scores.id) as homeTies
    from teams 
    left outer join v_matchup_scores on teams.id = v_matchup_scores.homeTeam and homeTeamPoints = awayTeamPoints and v_matchup_scores.endDate < CURDATE()
    group by teams.id) as home on teams.id = home.homeTeam
left outer join (select teams.id as awayTeam, count(v_matchup_scores.id) as awayTies
    from teams 
    left outer join v_matchup_scores on teams.id = v_matchup_scores.awayTeam and homeTeamPoints = awayTeamPoints and v_matchup_scores.endDate < CURDATE()
    group by teams.id) as away on teams.id = away.awayTeam
where teams.leagueId = :leagueIdInput
order by winsMinusLosses desc;

-- View Schedule

SELECT t.fantasyTeamName as homeTeam, t2.fantasyTeamName as awayTeam, m.week, v.homeTeamPoints, v.awayTeamPoints
FROM matchups m
INNER JOIN teams t ON m.hometeam = t.id
INNER JOIN teams t2 ON m.awayTeam = t2.id
INNER JOIN v_matchup_scores v ON v.id = m.id
WHERE t.leagueId = :leagueIdInput
ORDER BY m.week;

-- View fantasy points of a performance (FOR REFERENCE)
select p.id, (p.FGM*l.FGM + p.FGA*l.FGA + p.FTM*l.FTM + p.FTA*l.FTA + p.points*l.points + p.assists*l.assists + p.rebounds*l.rebounds + p.steals*l.steals + p.blocks*l.blocks + p.turnovers*l.turnovers) as FantasyPoints
from performances p
inner join leagues l on l.id = :leagueIdInput;

-- Total matchup score

select id, homeTeam, awayTeam, homeTeamPoints, awayTeamPoints
from v_matchup_scores
where id = :matchupIdInput;

-- View Matchup Details - home

select players.fName,
    players.lname,
    p.date,
    p.FGM,
    p.FGA,
    p.FTM,
    p.FTA,
    p.points,
    p.assists,
    p.rebounds,
    p.steals,
    p.blocks,
    p.turnovers,
    (p.FGM*l.FGM + p.FGA*l.FGA + p.FTM*l.FTM + p.FTA*l.FTA + p.points*l.points + p.assists*l.assists + p.rebounds*l.rebounds + p.steals*l.steals + p.blocks*l.blocks + p.turnovers*l.turnovers) as FantasyPoints
from performances p
inner join players on p.playerId = players.id
inner join teams_to_players ttp on players.id = ttp.playerId
inner join matchups on ttp.teamId = matchups.homeTeam
inner join teams on matchups.homeTeam = teams.id
inner join schedule on matchups.week = schedule.weekId
inner join leagues l on l.id = teams.leagueId
where matchups.id = :matchupIdInput
and p.date <= schedule.endDate
and p.date >= schedule.startDate;

-- View Matchup Details - away

select players.fName,
    players.lname,
    p.date,
    p.FGM,
    p.FGA,
    p.FTM,
    p.FTA,
    p.points,
    p.assists,
    p.rebounds,
    p.steals,
    p.blocks,
    p.turnovers,
    (p.FGM*l.FGM + p.FGA*l.FGA + p.FTM*l.FTM + p.FTA*l.FTA + p.points*l.points + p.assists*l.assists + p.rebounds*l.rebounds + p.steals*l.steals + p.blocks*l.blocks + p.turnovers*l.turnovers) as FantasyPoints
from performances p
inner join players on p.playerId = players.id
inner join teams_to_players ttp on players.id = ttp.playerId
inner join matchups on ttp.teamId = matchups.awayTeam
inner join teams on matchups.awayTeam = teams.id
inner join schedule on matchups.week = schedule.weekId
inner join leagues l on l.id = teams.leagueId
where matchups.id = :matchupIdInput
and p.date <= schedule.endDate
and p.date >= schedule.startDate;

-- View players - all

select distinct players.id, players.fName, players.lname, players.basketballTeam, players.position, avg.FGM, avg.FGA, avg.FTM, avg.FTA, avg.points, avg.assists, avg.rebounds, avg.steals, avg.blocks, avg.turnovers, (avg.FGM*l.FGM + avg.FGA*l.FGA + avg.FTM*l.FTM + avg.FTA*l.FTA + avg.points*l.points + avg.assists*l.assists + avg.rebounds*l.rebounds + avg.steals*l.steals + avg.blocks*l.blocks + avg.turnovers*l.turnovers) as FantasyPoints, t.abbreviation, t.id as teamId
from teams_to_players ttp 
inner join teams t on ttp.teamId = t.id and leagueId = :leagueIdInput
right outer join players on ttp.playerId = players.id
left outer join v_average_performances avg on players.id = avg.playerId
inner join leagues l on l.id = :leagueIdInput;

-- View players - unowned

select distinct players.id as playerId, players.fName, players.lname, players.basketballTeam, players.position, avg.FGM, avg.FGA, avg.FTM, avg.FTA, avg.points, avg.assists, avg.rebounds, avg.steals, avg.blocks, avg.turnovers, (avg.FGM*l.FGM + avg.FGA*l.FGA + avg.FTM*l.FTM + avg.FTA*l.FTA + avg.points*l.points + avg.assists*l.assists + avg.rebounds*l.rebounds + avg.steals*l.steals + avg.blocks*l.blocks + avg.turnovers*l.turnovers) as FantasyPoints
from teams_to_players ttp 
inner join teams t on ttp.teamId = t.id and leagueId = :leagueIdInput
right outer join players on ttp.playerId = players.id
left outer join v_average_performances avg on players.id = avg.playerId
inner join leagues l on l.id = :leagueIdInput
where t.abbreviation is NULL;

-- View players - specific Team

SELECT DISTINCT players.id, players.fName, players.lname, players.basketballTeam, players.position, avg.FGM, avg.FGA, avg.FTM, avg.FTA, avg.points, avg.assists, avg.rebounds, avg.steals, avg.blocks, avg.turnovers, (avg.FGM*l.FGM + avg.FGA*l.FGA + avg.FTM*l.FTM + avg.FTA*l.FTA + avg.points*l.points + avg.assists*l.assists + avg.rebounds*l.rebounds + avg.steals*l.steals + avg.blocks*l.blocks + avg.turnovers*l.turnovers) as FantasyPoints
FROM teams_to_players ttp 
INNER JOIN teams t ON ttp.teamId = t.id
RIGHT OUTER JOIN players ON ttp.playerId = players.id
left outer join v_average_performances avg on players.id = avg.playerId
inner join leagues l on l.id = :leagueIdInput
WHERE t.id = :teamIdInput;



-- Create League

LOCK TABLES `leagues` WRITE;
INSERT INTO `leagues`(name,FGM,FGA,FTM,FTA,points,assists,rebounds,steals,blocks,turnovers)
VALUES (:nameInput,:FGMInput,:FGAInput,:FTMInput,:FTAInput,:pointsInput,:assistsInput,:reboundsInput,:stealsInput,:blocksInput,:turnoversInput);
UNLOCK TABLES;

-- Add Player

LOCK TABLES `players` WRITE;
INSERT INTO `players`(fName,lName,basketballTeam,position)
VALUES (:fNameInput,:lNameInput,:NBATeamInput,:positionInput);
UNLOCK TABLES;

-- Add Team

LOCK TABLES `teams` WRITE;
INSERT INTO `teams`(fantasyTeamName,abbreviation,leagueId) 
VALUES (:teamNameInput,:abbreviationInput,:leagueIdInput);
UNLOCK TABLES;

-- Add Matchup

LOCK TABLES `matchups` WRITE;
INSERT INTO `matchups`(homeTeam,awayTeam,week) 
VALUES (:homeTeamInput,:awayTeamInput,:weekInput);
UNLOCK TABLES;

-- Add Performance

LOCK TABLES `performances` WRITE;
INSERT INTO `performances`(playerId,date,FGM,FGA,FTM,FTA,points,assists,rebounds,steals,blocks,turnovers) 
VALUES (:playerInput,:dateInput,:FGM_Input,:FGA_Input,:FTM_Input,:FTA_Input,:points_Input,:assists_Input,:rebounds_Input,:steals_Input,:blocks_Input,:turnovers_Input);
UNLOCK TABLES;

-- Add Schedule

LOCK TABLES `schedule` WRITE;
INSERT INTO `schedule` (startDate, endDate)
VALUES (:startDateInput, :endDateInput);
UNLOCK TABLES;

-- Add Player to Team

LOCK TABLES `teams_to_players` WRITE;
INSERT INTO `teams_to_players` (teamId,playerId)
VALUES (:teamIdInput,:playerIdInput);
UNLOCK TABLES;

--Remove Player from Team

LOCK TABLES `teams_to_players` WRITE;
DELETE FROM`teams_to_players` WHERE `teamId` = :teamIdInput AND playerId = :playerIdInput;
UNLOCK TABLES;

-- Remove Team

LOCK TABLES `teams` WRITE;
DELETE FROM `matchups` WHERE `homeTeam` = :teamIdInput OR `awayTeam` = :teamIdInput
DELETE FROM `teams_to_players` WHERE `teamId` = :teamIdInput
DELETE FROM `teams` WHERE `id` = :teamIdInput
UNLOCK TABLES;

--Update League Scoring System

LOCK TABLES `leagues` WRITE;
UPDATE `leagues` 
SET FGM = :FGMInput, 
    FGA = :FGAInput, 
    FTM = :FTMInput, 
    FTA = :FTAInput, 
    points = :pointsInput, 
    assists = :assistsInput, 
    rebounds = :reboundsInput, 
    steals = :stealsInput, 
    blocks = :blocksInput, 
    turnovers = :turnoversInput
WHERE id = :leagueIdInput;
UNLOCK TABLES;

