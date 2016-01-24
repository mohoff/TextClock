<?php
  $connection = ssh2_connect('185.8.86.141', 8080);
  ssh2_auth_password($connection, 'pi', 'raspberry');
  $stream = ssh2_exec($connection, '/home/pi/lcduhr/screenandmail.sh');
?>
