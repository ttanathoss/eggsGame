<?php
  $file_name = "results.json";
  if ($_SERVER['REQUEST_METHOD'] === 'GET')
    handleGETRequest($file_name);
  if ($_SERVER['REQUEST_METHOD'] === 'POST')
    handlePOSTRequest($file_name, $_POST);

  function handleGETRequest($file_name) {
    $file_content = file_get_contents($file_name);
    header('Content-Type: application/json');
    echo $file_content;
  }

  function handlePOSTRequest($file_name, $post) {
    $file_content = file_get_contents($file_name);
    $json = json_decode($file_content, true);
    array_push($json, $post);
    file_put_contents($file_name, json_encode($json));
    echo file_get_contents($file_name);
  }
?>