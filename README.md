# Drupal 7 Module Filter Toolbar
A quick, clean, and unintrusive Drupal 7 module filter that behaves like a Drupal-aware browser search. It's built with AUR (a Javascript framework of mine) and [LCES](https://github.com/b-fuze/lces) (a library of mine that AUR relies heavily on.)

## And?
Well, aside from some neat [hotkeys](#hotkeys) that's pretty much it. Have a look at some screenshots :D

![Screenshot](http://i.imgur.com/tyBGRSK.png "Just type on the page and stuff get highlighted")

Just type on the page and now you're filtering, press `[enter]` repeatedly till you find what you're looking for!

Here's a GIF showing what happens as you type
![Screen Recording](http://i.imgur.com/sBGGzPe.gif "DMFT in action")

## How do I get it?

Install GreaseMonkey (Firefox) or TamperMonkey (Chrome, Opera) then go [here](https://github.com/b-fuze/Drupal-Module-Filter-Toolbar/releases/download/v0.1.5/druseful.user.js), when it installs go to any Drupal module page and the toolbar should appear :)

## Hotkeys
 * **Enter:** Scroll to next match on the page
 * **Ctrl + Enter:** Toggle condensed list of matches
 * **Ctrl + M:** Switch between module or category filtering
 * **Esc:** Collapse list of matches (same as **Ctrl + Enter** when expanded)

## Disclaimer
I made it in about two days time, a quick side project to help me focus on my work in Drupal (lots of enabling, disabling, and uninstalling modules...) so I just needed a quick and hassle-free way to do it.

I've never used Drupal 8 up to this point, but DMFT can be ported easily, you will likely just need to change about 2 lines of code.

## License
Apache License 2.0
