<?php

$data_back = json_decode(file_get_contents('php://input'), true);

if ($_POST) {
	$nameHotdog = $_POST["hotdog"];
	$file = "../hotdogs.json";
	$json = json_decode(file_get_contents($file));
	unset($json->$nameHotdog);
	/*foreach ($json->$nameHotdog as $value) { 
		echo $value->name;	
	}*/
	//echo $json->$nameHotdog;
	file_put_contents($file, json_encode($json));
	//echo '<pre>' . print_r($json, true) . '</pre>';
	echo "You are delete this hotdog!";

} else echo "Shoose hotdog! ";

?>