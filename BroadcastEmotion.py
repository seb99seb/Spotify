BROADCAST_TO_PORT = 7000

import time
from socket import *
from datetime import datetime
from sense_hat import SenseHat

sense = SenseHat()
socket = socket(AF_INET, SOCK_DGRAM)
#s.bind(('', 14593))     # (ip, port)
# no explicit bind: will bind to default IP + random port
socket.setsockopt(SOL_SOCKET, SO_BROADCAST, 1)

# Define the colors
R = (255, 0, 0)
G = (0, 255, 0)
B = (0, 0, 255)
O = (0, 0, 0)

# Define the lists of pixel values
neutral = [
  O, O, B, B, B, B, O, O,
  O, B, O, O, O, O, B, O,
  B, O, B, O, O, B, O, B,
  B, O, O, O, O, O, O, B,
  B, O, O, O, O, O, O, B,
  B, O, B, B, B, B, O, B,
  O, B, O, O, O, O, B, O,
  O, O, B, B, B, B, O, O,
  ]

happy = [
  O, O, G, G, G, G, O, O,
  O, G, O, O, O, O, G, O,
  G, O, G, O, O, G, O, G,
  G, O, O, O, O, O, O, G,
  G, O, G, O, O, G, O, G,
  G, O, G, G, G, G, O, G,
  O, G, O, O, O, O, G, O,
  O, O, G, G, G, G, O, O,
  ]

sad = [
  O, O, R, R, R, R, O, O,
  O, R, O, O, O, O, R, O,
  R, O, R, O, O, R, O, R,
  R, O, O, O, O, O, O, R,
  R, O, R, R, R, R, O, R,
  R, O, R, O, O, R, O, R,
  O, R, O, O, O, O, R, O,
  O, O, R, R, R, R, O, O,
  ]

# Define the functions
def setneutral():
  sense.set_pixels(neutral)
  
def sethappy():
  sense.set_pixels(happy)
  
def setsad():
  sense.set_pixels(sad)

# Tell the program which function to associate with which direction
sense.stick.direction_up = setneutral
sense.stick.direction_down = sense.clear
sense.stick.direction_left = sethappy
sense.stick.direction_right = setsad
sense.stick.direction_middle = sense.clear

# This keeps the program running to receive joystick events
while True:
	for event in sense.stick.get_events():
		data = "Direction: " + str(event.direction) + ", Action: " + str(event.action)
		socket.sendto(bytes(data, "UTF-8"), ('<broadcast>', BROADCAST_TO_PORT))
		print(data)
		pass
