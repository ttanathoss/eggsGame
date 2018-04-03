<?php
  $plik = file_get_contents("results.json");
  $json = json_decode($plik, true);
  var_dump($json);
?>