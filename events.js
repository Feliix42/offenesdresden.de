function pad(s, l, p) {
    s = "" + s;
    while(s.length < l)
        s = p + s;
    return s;
}

function addevent(){
	window.open("addevent.html", "Event hinzufügen", "status=0, width=300, height=480");
}

function checkDate(){
	var startdate = document.getElementById("startdate").value.split(".");
	var enddate = document.getElementById("enddate").value.split(".");
	var starttime = document.getElementById("starttime").value.split(":");
	var endtime = document.getElementById("endtime").value.split(":");
	var current = new Date();
	var currentdate = [];
	var currenttime = [];
	currentdate[0] = current.getDate();
	currentdate[1] = current.getMonth();
	currentdate[2] = current.getFullYear();
	currenttime[0] = current.getHours();
	currenttime[1] = current.getMinutes();
	for(var i = 0; i < 3; i++){
		if(isNaN(startdate[i]) || isNaN(enddate[i]) || enddate[i] < currentdate[i] || startdate[i] < currentdate[i]){
			return false;
		}
	}
	for(var i = 0; i < 2; i++){
		if(isNaN(starttime[i]) || isNaN(endtime[i]) || starttime[i] < currenttime[i] || endtime[i] < currenttime[i]){
			return false;
		}
	}
	if(startdate[0] > 31 || enddate[0] > 31 || startdate[1] > 12 || enddate[1] > 12 || starttime[0] > 24 || endtime[0] > 24 || starttime[1] > 60 || endtime[1] > 60){
		return false;
	}else{
		return true;
	}
}

function checkFilled(){
	var userinput = [];
	userinput[0] = document.getElementById("title").value;
	userinput[1] = document.getElementById("location").value;
	userinput[2] = document.getElementById("link").value;
	userinput[3] = document.getElementById("mail").value;
	for(var i = 0; i < 4; i++){
		if(userinput[i].length == 0){
			return false;
		}
	}
	return true;
}

function validate(){
	var form = document.getElementById("eventform");
	var check = checkFilled();
	if(checkDate() && checkFilled()){
		form.removeAttribute("onSubmit");
		form.setAttribute("action", "addevent.php");
	}else{
		//alert("Falsche Eingabe!");
	}
}

function leadingZero(date){
	if(date < 10){
		return "0" + date;
	}else{
		return date;
	}
}

function setDate(){
	var date = new Date();
	var day = leadingZero(date.getDate());
	var month = leadingZero(date.getMonth() + 1);
	var year = date.getFullYear();
	var hour = leadingZero(date.getHours());
	var endhour = leadingZero(date.getHours() + 1);
	var minute = leadingZero(date.getMinutes());
	document.getElementById("startdate").value=day+"."+month+"."+year;
	document.getElementById("starttime").value=hour+":"+minute;
	document.getElementById("enddate").value=day+"."+month+"."+year;
	document.getElementById("endtime").value=endhour+":"+minute;
}

$.ajax({ url: "events.json" }).done(function(events) {
    var now = Date.now();
    var article = $("<article class='events'><h2>Nächste Treffen</h2></article>");
    var ul = $("<ul></ul>");
    events.forEach(function(event) {
        event.time = new Date(event.date).getTime();
    });
    events = events.filter(function(event) {
        return event.time >= now;
    }).sort(function(e1, e2) {
        return e1.time - e2.time;
    });
    events.forEach(function(event) {
        var li = $("<li><p class='title'></p><p><span class='date'></span> <a>Ort</a></p></li>");
        li.find('.title').text(event.title);
        var d = new Date(event.date);
        li.find('.date').text(
            d.getDate() + "." +
                (d.getMonth() + 1) + "." +
                d.getFullYear() + " " +
                pad(d.getHours(), 2, "0") + ":" +
                pad(d.getMinutes(), 2, "0")
        );
        li.find('a').attr('href', event.location);
        ul.append(li);
    });
    ul.append($('<li><a href onClick="addevent()">Termin einreichen</a>.</li>'));
    article.append(ul);
    article.append($("<p>Die Termine sind auch <a href='events.json'>maschinenlesbar erhältlich</a>.</p>"));
    $('#main').prepend(article);
}).fail(function() {
    console.error("ajax", arguments);
});
