#!/usr/bin/env python
# -*- coding: utf-8 -*-

import RPi.GPIO as GPIO
import time
import random
import urllib2
import fcntl, socket, struct, sys
from subprocess import call
import time


# Get MAC address in a format that can be embedded in a URL
def getHwAddr(ifname):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    info = fcntl.ioctl(s.fileno(), 0x8927,  struct.pack('256s', ifname[:15]))
    return ''.join(['%02x' % ord(char) for char in info[18:24]])


GPIO.setmode(GPIO.BCM)
PIR_PIN = 4
myName = getHwAddr('eth0')
GPIO.setup(PIR_PIN, GPIO.IN)

startTime = time.time();

if len(sys.argv) > 1 and sys.argv[1] == "test" :
	testMode = True
else :
	testMode = False
    
    
def MOTION(PIR_PIN):
    print 'Motion Detected! Calling http://iot.merck.com/IOT-api/%s%d/moveDetected:' % (myName, PIR_PIN)
    call(["node", "../hueLights/setColor.js", "5", "red"])
    global startTime
    startTime = time.time();
    if not testMode : 
	response = urllib2.urlopen('http://iot.merck.com/IOT-api/%s%d/moveDetected:' % (myName, PIR_PIN))
	data = response.read()
	print data

print 'GIN@S Motion Detection initializing... (CTRL+C to exit)'
time.sleep(2)

try:
    GPIO.add_event_detect(PIR_PIN, GPIO.RISING, callback=MOTION)
    print 'Unit '+myName+' Ready'
    print 'Sending http://iot.merck.com/IOT-api/%s%d/boot:' % (myName, PIR_PIN)
    if not testMode : 
	response = urllib2.urlopen('http://iot.merck.com/IOT-api/%s%d/boot:' % (myName, PIR_PIN))
	data = response.read()
	print data

    while 1:
        time.sleep(60)   # send heartbeat every 15 minutes
	currentTime = time.time();
	print (currentTime - startTime);
        print 'Sending http://iot.merck.com/IOT-api/%s%d/pulse:' % (myName, PIR_PIN)
	if abs(currentTime - startTime) > 30 : 
		call(["node", "../hueLights/setColor.js", "5", "green"])
	if not testMode : 
		start_time = time.time()
		response = urllib2.urlopen('http://iot.merck.com/IOT-api/%s%d/pulse:' % (myName, PIR_PIN))
		data = response.read()
		print data
except (KeyboardInterrupt, SystemExit):
    print 'Quit'
    GPIO.cleanup()
    raise
except: 
    print 'Error contacting iot.merck.com', sys.exc_info()[0]
    delay = random.randint(60,180)  # Wait at least 1 minute and maybe more to avoid flooding the server 
    print 'Waiting %d seconds...' % (delay)
    time.sleep(delay)
    print 'Now Retrying to contact the server.'

