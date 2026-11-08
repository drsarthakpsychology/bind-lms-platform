import sys, math
from PIL import Image, ImageFilter, ImageOps, ImageChops, ImageDraw

INK=(20,20,20); BLUE=(29,68,216); LIME=(205,242,75); CREAM=(255,253,242); PINK=(255,170,190)

def prep(path, size=360):
    im=Image.open(path).convert("RGBA")
    bbox=im.getchannel("A").point(lambda v:255 if v>40 else 0).getbbox()
    im=im.crop(bbox)
    s=size/max(im.size); im=im.resize((max(1,int(im.width*s)),max(1,int(im.height*s))), Image.LANCZOS)
    return im

def sticker(art, alpha, pad=14, outline=7, shadow=6):
    W,H=art.width+2*pad+shadow, art.height+2*pad+shadow
    out=Image.new("RGBA",(W,H),(0,0,0,0))
    a=Image.new("L",(W,H),0); a.paste(alpha,(pad,pad))
    a=a.point(lambda v:255 if v>110 else 0)
    ring=a.filter(ImageFilter.MaxFilter(outline*2+1))
    shm=Image.new("L",(W,H),0); shm.paste(ring.crop((0,0,W-shadow,H-shadow)),(shadow,shadow))
    out.paste(Image.new("RGBA",(W,H),BLUE+(255,)),(0,0),shm)
    white=Image.new("RGBA",(W,H),CREAM+(255,)); 
    ring_in=a.filter(ImageFilter.MaxFilter(outline+ (1 if outline%2==0 else 0)))
    out.paste(Image.new("RGBA",(W,H),INK+(255,)),(0,0),ring)
    out.paste(white,(0,0),ring_in)
    layer=Image.new("RGBA",(W,H),(0,0,0,0)); layer.paste(art,(pad,pad))
    out.paste(layer,(0,0),a)
    return out

def riso(im, cell=6, angle=22):
    rgb=Image.new("RGB",im.size,(255,255,255)); rgb.paste(im,mask=im.getchannel("A"))
    g0=ImageOps.grayscale(rgb)
    # Even out the tones inside the animal only, so dark fur still shows its features.
    mask=im.getchannel("A").point(lambda v:255 if v>100 else 0)
    g=ImageOps.equalize(g0,mask=mask)
    g=Image.blend(g,ImageOps.autocontrast(g0,cutoff=2),0.35)
    W,H=g.size; big=4
    paper=Image.new("RGB",(W*big,H*big),CREAM); d=ImageDraw.Draw(paper)
    ca,sa=math.cos(math.radians(angle)),math.sin(math.radians(angle))
    R=int((W+H)/cell)+2
    gp=g.load()
    for i in range(-R,R):
        for j in range(-R,R):
            x=(i*ca-j*sa)*cell+W/2; y=(i*sa+j*ca)*cell+H/2
            if 0<=x<W and 0<=y<H:
                v=gp[int(x),int(y)]
                r=(1-v/255)**0.9*cell*0.72
                if r>0.35: d.ellipse([(x-r)*big,(y-r)*big,(x+r)*big,(y+r)*big],fill=BLUE)
    paper=paper.resize((W,H),Image.LANCZOS)
    # ink layer: darkest areas + edges
    edges=g.filter(ImageFilter.GaussianBlur(1.4)).filter(ImageFilter.FIND_EDGES).point(lambda v:255 if v>46 else 0)
    hist=g.histogram(mask=mask); tot=sum(hist); acc=0; cut=0
    for k,n in enumerate(hist):
        acc+=n
        if acc>tot*0.07: cut=k; break
    dark=g.point(lambda v:255 if v<=cut else 0)
    inkm=ImageChops.lighter(edges,dark).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    paper.paste(Image.new("RGB",(W,H),INK),(0,0),inkm)
    out=paper.convert("RGBA"); out.putalpha(im.getchannel("A"))
    return out

def pixel(im, px=72):
    s=px/max(im.size); small=im.resize((max(1,int(im.width*s)),max(1,int(im.height*s))),Image.BILINEAR)
    rgb=Image.new("RGB",small.size,(255,255,255)); rgb.paste(small,mask=small.getchannel("A"))
    g=ImageOps.autocontrast(ImageOps.grayscale(rgb),cutoff=2)
    pal=[INK,BLUE,(122,150,240),LIME,CREAM]
    cuts=[50,100,150,205]
    q=Image.new("RGB",small.size); qp=q.load(); gp=g.load()
    for y in range(small.height):
        for x in range(small.width):
            v=gp[x,y]; k=sum(v>c for c in cuts); qp[x,y]=pal[k]
    q=q.convert("RGBA"); q.putalpha(small.getchannel("A").point(lambda v:255 if v>100 else 0))
    return q.resize(im.size,Image.NEAREST)

if __name__=="__main__":
    src,dst,mode=sys.argv[1],sys.argv[2],sys.argv[3]
    im=prep(src)
    art=riso(im) if mode=="riso" else pixel(im)
    a=art.getchannel("A")
    sticker(art,a).save(dst)
