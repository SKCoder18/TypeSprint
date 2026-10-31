"""Original procedural TypeSprint animation. No external footage or samples."""
import sys, math, subprocess
from pathlib import Path
from PIL import Image, ImageDraw
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'.asset-tools'))
import imageio_ffmpeg
root=Path(__file__).resolve().parents[1]
w,h,fps,seconds=640,360,20,60
base=Image.new('RGB',(w,h));d=ImageDraw.Draw(base)
for y in range(h):
 t=y/h;d.line((0,y,w,y),fill=(int(8+32*t),int(19+33*t),int(45+40*t)))
encoder=subprocess.Popen([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{w}x{h}','-r',str(fps),'-i','-','-an','-vcodec','libx264','-pix_fmt','yuv420p','-crf','24','-movflags','+faststart',str(root/'public/media/horizon-flight.mp4')],stdin=subprocess.PIPE,stderr=subprocess.DEVNULL)
for frame in range(fps*seconds):
 t=frame/fps;im=base.copy();d=ImageDraw.Draw(im)
 d.ellipse((470,40,540,110),fill=(244,185,137))
 for layer in range(3):
  shift=(t*(8+layer*13))%260
  for i in range(-1,4):
   x=i*260-shift;d.polygon([(x,230+layer*18),(x+120,100+layer*35),(x+260,230+layer*18)],fill=[(37,46,77),(40,64,89),(30,82,95)][layer])
 d.rectangle((0,275,640,360),fill=(11,42,62))
 for i in range(25):
  x=(i*79-t*40)%700-40;y=285+(i%7)*11;d.line((x,y,x+40,y),fill=(67,126,143),width=1)
 # Original paper-like glider, banked gently along an animated path.
 x=200+math.sin(t*.35)*80;y=175+math.sin(t*.8)*25
 d.polygon([(x-65,y+12),(x+76,y),(x-20,y-20),(x-5,y)],fill=(81,236,226))
 d.polygon([(x-5,y),(x+76,y),(x-35,y+28)],fill=(37,137,172))
 for i in range(5):d.line((x-100-i*12,y+10,x-80-i*12,y+10),fill=(52,112,141))
 d.text((24,22),'TYPESPRINT ORIGINAL / HORIZON FLIGHT',fill=(193,235,239))
 d.text((24,333),f'{int(t):02d} / 60  -  FIND YOUR FLOW',fill=(164,205,222))
 encoder.stdin.write(im.tobytes())
encoder.stdin.close();assert encoder.wait()==0
print('Created original 60-second H.264 video.')
