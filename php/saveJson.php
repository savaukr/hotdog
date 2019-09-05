<?php
	$data = json_decode(file_get_contents('php://input'), true);
	$file = "../hotdogs.json";
	file_put_contents($file, json_encode($data));
	print_r($data);
?>