<head>
    <link rel="stylesheet" type="text/css" href="style.css">    
</head>
<html>

<title>Knowhere Bank</title>
<?php
// Start a session
session_start();

// Check if John's balance is greater than 2000
if ($_SESSION['users']['Groot'] > 2000) {

    echo "<img src='groot-money.jpg'>";
echo "</br></br>";
    echo "Here is the secret for you shctf{7h3_c0sm0s_1s_w17h1n_u5}.";
    
} else {
    echo "You are not allowed. Only the members who have balance more than 2000 are allowed to get the secret";
}
?>

