# Setting up redis with example config and system unit.

6379.conf - etc/redis/
redis.service /etc/systemd/system/

Log file dir and working dir should be chowned by redis:redis and 755.

sudo systemctl redis start
sudo systemctl redis status
