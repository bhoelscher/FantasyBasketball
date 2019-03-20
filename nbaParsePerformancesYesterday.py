import json
import urllib.request
import datetime
import mysql.connector
txt = urllib.request.urlopen('http://data.nba.net/10s/prod/v1/today.json').read()
data = json.loads(txt)
baseurl = 'http://data.nba.net/10s'
playersurl = baseurl + data['links']['leagueRosterPlayers']
playersreq = urllib.request.urlopen(playersurl).read()
players = json.loads(playersreq)
playerLookup = {}
today = data['links']['currentDate']
todayDate = datetime.datetime(int(today[:4]),int(today[4:6]),int(today[6:]))
todayDate = todayDate + datetime.timedelta(days=-1)
today = todayDate.strftime("%Y%m%d")
todayLink = '/prod/v2/' + today + '/scoreboard.json'
todayScoreboardurl = baseurl + todayLink
todayreq = urllib.request.urlopen(todayScoreboardurl).read()
todaygames = json.loads(todayreq)
mydb = mysql.connector.connect(
    host="XXXXXXXX",
    user="XXXXXXXX",
    passwd="XXXXXXXX",
    database="XXXXXXXX"
)
mycursor = mydb.cursor()
mycursor.execute("SELECT id, nbaId FROM players")
myresult = mycursor.fetchall()
for x in myresult:
    playerLookup[str(x[1])] = x[0]
for x in todaygames['games']:
    boxscorelink = baseurl + '/prod/v1/' + today + '/' + x['gameId'] + '_boxscore.json'
    boxscorereq = urllib.request.urlopen(boxscorelink).read()
    boxscore = json.loads(boxscorereq)
    for p in boxscore['stats']['activePlayers']:
        pid = str(p['personId'])
        if pid in playerLookup:
            insert = "INSERT INTO `performances`(playerId,date,FGM,FGA,FTM,FTA,points,assists,rebounds,steals,blocks,turnovers) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
            date = str(today)[:4] + '-' + str(today)[4:6] + '-' + str(today)[6:]
            vals = (playerLookup[pid],date,p['fgm'],p['fga'],p['ftm'],p['fta'],p['points'],p['assists'],p['totReb'],p['steals'],p['blocks'],p['turnovers'])
            mycursor.execute(insert,vals)
            mydb.commit()
