<?php
  $file_name = "results.json";
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
    var_dump(array_push($json, $post));
    echo json_encode($json);
    // var_dump($file_content);
    // var_dump($json);
    // var_dump($post);
    // var_dump($json);
  }
?>