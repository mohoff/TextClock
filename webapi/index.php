<?php
  // ssh2_connect() is probably blocked from alfahosting.de

  //$connection = ssh2_connect('185.8.86.141', 8080);
  //ssh2_auth_password($connection, 'pi', 'raspberry');
  //$stream = ssh2_exec($connection, '/home/pi/TextClock/screenandmail.sh');
?>


<?php
  include('Net/SSH2.php');

  // Can't connect for some reason
  $ssh = new Net_SSH2("185.8.86.141", 8080);
  if (!$ssh->login("pi", "raspberry")) {
      exit('Login Failed');
  }

  echo $ssh->exec('/home/pi/TextClock/screenandmail.sh');
?>
