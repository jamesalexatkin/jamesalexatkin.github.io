---
title: 'Creating "Mot du Jour"'
description: "Building a desk companion to learn French, one word at a time."
tags: ["arduino", "esp32", "go"]
date: "2025-07-29"

cover:
  image: "https://miro.medium.com/v2/resize:fit:720/format:webp/0*QES5qTKIRY8TeGmv.png"
  alt: "Example album in Sonixd client connected to Navidrome instance"
  caption: "Example album in Sonixd client connected to Navidrome instance"
  relative: false
---

At the start of 2025, I resolved to do something I'd been meaning to do for years: pick up language learning again. I hadn't touched French since finishing GCSEs over a decade ago, but a trip to Italy sparked my interest again.

I find languages fascinating since they exist at such a unique juncture of culture, history, and how people think.
Of course there's rules and grammar, but so much of "why we say things" (in any language) is so much more wishy-washy, and often steeped in clues about the pasts of the peoples that speak them today.

Around the same time, I rediscovered a box of electronics components I'd bought ages back with vague ambitions of building "something." (Of course life marched relentlessly on and I promptly forgot all about them.)
Among them was a tiny 2.13" e-ink display, perfect for something minimal that I could sit on my desk.

That's when I decided to build something: a **French "word of the day"** (_un mot du jour_) display.

{{< figure src="https://jamesatk.in/writing/images/mot-du-jour.png" alt="Mot du jour finished" align=center caption="Chouette indeed" >}}

---

# 🤔 The gist

ESP32 chips are really nice since they have Wi-Fi onboard out-of-the-box. I could set this up to synchronise with some web service to get a new definition each day.

I looked for an API initially, but a foreign word of the day (particularly with definitions in a language other than the target!) is rather niche.
There are however quite a few websites offering online dictionaries. I've used web scraping before in a couple of previous projects [ex. 1](https://github.com/jamesalexatkin/caribou-visualiser) [ex. 2](https://github.com/jamesalexatkin/tauntaun) so figured something similar could come in handy.

After considering [WordReference](https://www.wordreference.com/), I settled on [Wiktionary](https://en.wiktionary.org/wiki/Wiktionary:Main_Page) as I prefer the style of definitions.

With the lack of on onboard clock, I'd also need to synchronise time with an NTP server to ensure the word was fetched on time.

{{< figure src="https://jamesatk.in/writing/images/mot-du-jour-architecture.png" alt="Project architecture overview" align=center caption="Architecture overview" >}}

# ⚙️ Hardware

I used the following components:

- [WeActStudio 2.13" Epaper module white-black-red](https://www.aliexpress.com/item/1005004644515880.html) (250 x 122 pixel resolution)
- [WeAct Studio ESP32-DOWD-V3](https://www.aliexpress.com/item/1005005645111663.html)
- A USB-C cable

The pins for the ESP32 were connected like so:

| Label | Colour | Purpose                                                                                   | Pin     |
| ----- | ------ | ----------------------------------------------------------------------------------------- | ------- |
| BUSY  | 🟪     | Allows chip to know that the display is currently busy doing something                    | 15      |
| RES   | 🟧     | Reset                                                                                     | 2       |
| D/C   | ⬜     | Data/Command - used by the chip to toggle between sending data or commands to the display | 0       |
| CS    | 🟦     | Chip Select - identifies specific peripheral this display is                              | 5       |
| SCL   | 🟩     | Serial Clock - used to synchronise data transmission                                      | 18      |
| SDA   | 🟨     | Serial Data - used to send data to the display                                            | 23      |
| GND   | ⬛     | Ground                                                                                    | Any GND |
| VCC   | 🟥     | Power                                                                                     | Any 3V3 |

_(These were somewhat fiddly and I had to crimp some of the Dupont cable heads with pliers.)_

# 💽 ESP Software

> Repository: [https://github.com/jamesalexatkin/mot-du-jour-esp32](https://github.com/jamesalexatkin/mot-du-jour-esp32)

These were useful libraries that I installed with Arduino IDE's Library Manager:

- [**esp32** by Espressif Systems](https://github.com/espressif/arduino-esp32) - necessary to flash my particular board. I used the option `ESP32 Dev Module`.
- [GxEPD2](https://github.com/ZinggJM/GxEPD2) - for drawing to the display.
- [U8g2_for_Adafruit_GFX](https://github.com/olikraus/U8g2_for_Adafruit_GFX) - since accented characters are integral to French (and indeed many non-English languages), this library was super handy for adding other fonts to the display.
- [ArduinoJSON](https://github.com/bblanchon/ArduinoJson)
- [StreamUtils](https://github.com/bblanchon/ArduinoStreamUtils)

[This article](https://randomnerdtutorials.com/esp32-esp8266-run-daily-task/) was particularly useful in shaping the structuring of a daily operation on the chip.

For the first C++ code I'd written since uni, I don't think this turned out too badly.

# ☁️ Proxy API

> Repository: [https://github.com/jamesalexatkin/mot-du-jour-api](https://github.com/jamesalexatkin/mot-du-jour-api)

This was a simple Go API I deployed up with a couple of endpoints. After searching for some free hosting, I came across [Render](https://render.com/) which offers a [free tier](https://render.com/pricing) for hobby projects.
(The service is simple enough that I'd consider self-hosting in future though.)

As well as the main `GET /mot_du_jour` route for returning a daily word, I also included `GET /mot_spontane` (_mot spontané_) for returning a different, spontaneous word on each call.

The main challenge here was scraping the information from Wiktionary. Thankfully, there is a [random page](https://en.wiktionary.org/wiki/Wiktionary:Random_page) link. I was hoping it would be more structured, however it seems the HTML is in a flat structure rather than hierarchical.
HTML scraping can be fiddly at the best of times, let alone when most of the titles and definitions are rendered as sibling page elements, rather than neatly organised into their own `div`s.

The [goquery](https://github.com/PuerkitoBio/goquery) library came in useful here.

# 🏫 What did I learn?

- Hardware is tricky and very fiddly, but very satisfying having something in front of you when it works.
- How to contact NTP and set time on Arduino board.
- How to do HTML parsing of Wiktionary.

# ➡️ Future steps

I'd love to develop some case/shell to house the electronics of this. I've seen a couple of interesting ideas [(ex. 1)](https://old.reddit.com/r/esp32/comments/1kgrwxk/minimal_github_commit_tracker_using_an_esp32_and/) [(ex. 2)](https://www.hackster.io/Gokux/esticky-a-tiny-paperless-way-to-keep-your-thoughts-organize-d0cd05) for small 3D printed e-ink display cases so may do something like this.

# 📚 References

- [WeAct Studio Epaper Module reference](https://github.com/WeActStudio/WeActStudio.epapermodule)
- [WeActStudio.ESP32CoreBoard reference](https://github.com/WeActStudio/WeActStudio.ESP32CoreBoard)
- [Weact Studio ESP32 D0WD V3 Pinout(Partial)](https://forum.arduino.cc/t/weact-studio-esp32-d0wd-v3-pinout-partial/1297935)
- [Wiktionary random page](https://en.wiktionary.org/wiki/Wiktionary:Random_page)
- [ESP32/ESP8266: Run Daily Task at Specific Time (Arduino IDE)](https://randomnerdtutorials.com/esp32-esp8266-run-daily-task/)
