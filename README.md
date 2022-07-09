# fallingSand
a place to play with falling sand simulations in processing, p5 and python

I am using some ideas and logic from this great blog.

 https://blog.winter.dev/2020/falling-sand-games/
 
However I am implementing like 'game of life'  using two arrays grid[][] and nextGrid[][]

[fixed] having some trouble with the logic of sand falling through water 

use the drag and press the mouse while holding 

- 's' to drop sand

- 'w' to drop water

- 'r' to place rock (even in the sky )

- 'x' to destroy


I would like to add some living growing plants


Water was overwriting sand in the base case when there was no movement for it. needed to check that that cell had not turned to sand 

in the next generation

sand in water makes tall towers because it only checks the spot below

sand in air makes pyramids becaues it checks down left and right
