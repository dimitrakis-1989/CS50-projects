<?php

    // configuration
    require("../includes/config.php"); 
    date_default_timezone_set('Europe/Athens');
    $hmnia = date("m/d/Y");
    
    $rows = query("SELECT * FROM tameio WHERE id = ?", $_SESSION["id"]);
    $balance = $rows[0]["esoda"] - $rows[0]["exoda"];
     
#    $rows = query("SELECT * FROM sharesumm WHERE id = ?", $_SESSION["id"]);
#    #dump($rows);
#    $balance = 0;
#    $positions = [];
#    unset($_SESSION["flag"]);
#    unset($_SESSION["buyf1"]);
#    unset($_SESSION["buyf2"]);
#    foreach ($rows as $row)
#    {
#        $stock = lookup($row["symbol"]);
#        if ($stock !== false)
#        {
#            $positions[] = [
#                "name" => $stock["name"],
#                "price" => number_format($stock["price"], 2),
#                "shares" => $row["shares"],
#                "symbol" => $row["symbol"],
#                "total" => number_format($stock["price"], 2) * $row["shares"]
#            ];
#            $balance = $balance + number_format($stock["price"], 2) * $row["shares"];
#        }
#    }
#    $cash = 10000 - $balance;
#    
#    query("UPDATE users SET cash = ? WHERE id = ?", $cash, $_SESSION["id"]);
#    
#    unset($_SESSION["flag"]);
#    unset($_SESSION["buyf1"]);
#    unset($_SESSION["buyf2"]);
    
    // render home
    render("home.php", ["title" => "Home", "today" => $hmnia, "balance" => $balance]);
    

?>
