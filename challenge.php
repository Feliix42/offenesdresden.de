<?php
session_start();

$message = "";
function sendEvent($title, $content){
	global $message;
	$rcv = array(
		"OpenData" => "rob.tranquillo@gmx.de", //rob.tranquillo@gmx.de
		"c3d2" => "c3d2@lists.c3d2.de", //c3d2@lists.c3d2.de
	);

	$to = $rcv[$_SESSION["type"]];
	$header = "From: ".$_SESSION["mail"]."\r\nReply-To: ".$_SESSION["mail"]."\r\nX-Mailer: PHP/".phpversion();
	if(mail($to, $title, $content, $header)){
		$message = "Ihr Event wurde eingereicht.";
	}else{
		$message =  "Es ist leider ein Fehler aufgetreten.";
	}
}

$challenge = $_POST["challenge"];
if($challenge == $_SESSION["challenge"]){
	sendEvent($_SESSION["title"], $_SESSION["xml"]);
}else{	/* todo:move formatting tags to the receiver or drop 'em */
	$message =  "Der eingegebene Key ist ung&uuml;ltig.";
}

session_destroy();
?>
<html>
<head>
</head>
<body>
<p>
<?php 
	global $message;
	echo $message;
?>
</p>
</body>
</html>
