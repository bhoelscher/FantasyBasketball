import json
import urllib.request
import mysql.connector
txt = urllib.request.urlopen('http://data.nba.net/10s/prod/v1/today.json').read()
data = json.loads(txt)
baseurl = 'http://data.nba.net/10s'
teamsurl = baseurl + data['links']['teamsConfig']
teamsreq = urllib.request.urlopen(teamsurl).read()
teams = json.loads(teamsreq)
teamLookup = {}
for x in teams['teams']['config']:
    if 'ttsName' in x:
        teamLookup[x['teamId']] = x['ttsName']
playersurl = baseurl + data['links']['leagueRosterPlayers']
playersreq = urllib.request.urlopen(playersurl).read()
players = json.loads(playersreq)
mydb = mysql.connector.connect(
    host="XXXXXXXX",
    user="XXXXXXXX",
    passwd="XXXXXX",
    database="XXXXXXXX"
)
mycursor = mydb.cursor()
for x in players['league']['standard']:
    insert = "INSERT INTO `players`(fName,lName,basketballTeam,position,nbaId) VALUES (%s,%s,%s,%s,%s)"
    vals = (x['firstName'],x['lastName'],teamLookup[x['teamId']],x['pos'],x['personId'])
    mycursor.execute(insert,vals)
    mydb.commit()
