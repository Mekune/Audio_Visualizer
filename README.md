# How it work ?

you need to install "PulseAudio" and his GUI "Pavucontrol" to emulate your device's audio output as a microphone input so that the script listens to what your device hears

## WARNING

web browsers have a security feature that means you can't launch functions such as the microphone without human intervention, so you have to return to the home page to get the audio visualizer to work.

## Install PulseAudio(Tool) & PavuControl(GUI)

### Ubuntu/Debian

sudo apt install pulseaudio

sudo apt install pavucontrol

###  Fedora

sudo dnf install pulseaudio

sudo dnf install pavucontrol

### Arch / Manjaro

sudo pacman -S pulseaudio

sudo pacman -S pavucontrol

### OpenSUSE

sudo zypper install pulseaudio

sudo zypper install pavucontrol

### Start PavuControl(GUI)

pavucontrol

## How to emulate your device's audio output as a microphone input ?

### Method 1 - Real output Device

Set the application's output device to your output device ("sof-hda-dsp Speaker + Headphones" for me ) and the input device to "Monitor of sof-hda-dsp Speaker + Headphones".

You need to have opened your ouput application like Youtube, Spotify to see him, same for the output

### Method 2 - Virtual output Device

First create a virutal output :

- pactl load-module module-null-sink sink_name=VirtualSink

After that, set the application's output device to VirtualSink and the input device to Monitor of VirtualSink.

You need to have opened your ouput application like Youtube, Spotify to see him, same for the output
