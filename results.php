<?php
  $file_name = "results.json";
  header('Content-Type: application/json');
  if ($_SERVER['REQUEST_METHOD'] === 'GET')
    handleGETRequest($file_name);
  if ($_SERVER['REQUEST_METHOD'] === 'POST')
    handlePOSTRequest($file_name, $_POST);

  function handleGETRequest($file_name) {
    $file_content = file_get_contents($file_name);
    echo $file_content;
  }

  function handlePOSTRequest($file_name, $post) {
    $file_content = file_get_contents($file_name);
    $json = json_decode($file_content, true);
    if(array_key_exists("user", $post) && array_key_exists("result", $post) && is_numeric($post["result"])) {
      $post["result"] = intval($post["result"]);
      array_push($json, $post);
      file_put_contents($file_name, json_encode($json));
    }
    echo file_get_contents($file_name);
  }
?>