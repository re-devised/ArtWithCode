const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * 0.01

    
    const columns = 5
    const rows = 5

    const w   = width   * 0.1
    const h   = height  * 0.1
    const gap = width   * 0.03
    const ix  = (width-((w + gap)*columns -gap))/2
    const iy  = (height-((h + gap)*rows -gap))/2


    const off = width   * 0.02


    for (let i = 0; i < 5; i++){ 
        for (let j = 0; j < 5; j++){ 
            
            let x = ix + (w + gap)*i
            let y = iy + (h + gap)*j

            //outer rectangles
            context.beginPath()
            context.rect(x, y, w, h)
            context.stroke()

            //inner rectangles
            if (Math.random() > 0.5){
                context.beginPath()
                context.rect(x+off/2, y+off/2, w-off, h-off)
                context.stroke()
            }
        }
    }        
  };
};

canvasSketch(sketch, settings);
