http http://localhost:3000/user-joined id=1 name=sahas
sleep 0.5
http http://localhost:3000/user-joined id=5 name=latha
http http://localhost:3000/user-joined id=4 name=ian
sleep 1
http http://localhost:3000/user-joined id=3 name=naveen
http http://localhost:3000/user-joined id=2 name=trentin
sleep 0.3
http http://localhost:3000/user-left id=4 name=ian
http http://localhost:3000/user-left id=3 name=naveen
sleep 1
http http://localhost:3000/user-joined id=3 name=naveen
sleep 0.6
http http://localhost:3000/user-joined id=4 name=ian
sleep 1
http http://localhost:3000/user-left id=1 name=sahas
sleep 1
http http://localhost:3000/user-left id=5 name=latha