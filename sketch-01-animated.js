const canvasSketch = require('canvas-sketch');
const { lerpFrames } = require('canvas-sketch-util/math');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ({ context, width, height, frame }) => {
  
  const framesPerLoop = 90
  const innerSquareWidth = 8

  const columns = 5
  const rows = 5

  const w   = width   * 0.1
  const h   = height  * 0.1
  const gap = width   * 0.03
  const ix  = (width-((w + gap)*columns -gap))/2
  const iy  = (height-((h + gap)*rows -gap))/2

  const off = width   * 0.01


  //create Square Objects
  const squares = []
  for (let i = 0; i < rows; i++){ 
    for (let j = 0; j < columns; j++){ 
        
        let x = ix + (w + gap)*i
        let y = iy + (h + gap)*j
        squares.push(new Square(x,y,(Math.random() > 0.7)))
    }
  } 

  //update Function
  let actualFrame = 0
  return ({ context, width, height, frame }) => {
    context.fillStyle = '#212529';
    context.fillRect(0, 0, width, height);
    

    if(frame % framesPerLoop == 0 && frame != actualFrame){
      //changing the next random bold squares for the next loop
      squares.forEach(square => square.isBold = (Math.random() > 0.7))
      //making sure it only works the first time this frame runs since the function is called multiple times within the same frame without this method
      actualFrame = frame
    }

    squares.forEach(square => {
      
      //outer rectangles
      context.lineWidth = width * 0.01
      context.strokeStyle = "#f8f9fa"
      context.beginPath()
      context.rect(square.x, square.y, w, h)
      context.stroke()

      //inner rectangles
      if (square.isBold){
          
          // Linear Interpolation for Line Width
          let lineWidth = 0
          if((frame % framesPerLoop) < framesPerLoop/2){
            lineWidth = innerSquareWidth*width * math.mapRange(frame % framesPerLoop, 0, framesPerLoop/2, 0.0001, 0.01)
          }else{
            lineWidth = innerSquareWidth*width * math.mapRange(frame % framesPerLoop, framesPerLoop/2, framesPerLoop, 0.01, 0.0001)
          }
          context.lineWidth = lineWidth
          context.strokeStyle = "#f8f9fa"
          context.beginPath()
          context.rect((square.x+off/2)+lineWidth/2-1, (square.y+off/2)+lineWidth/2-1, w-off-lineWidth+2, h-off-lineWidth+2)
          context.stroke()
      }
    })     
  };
};


class Square {
  constructor(x,y, isBold=false){
    this.x = x
    this.y = y
    this.isBold = isBold
    this.vel = 1
  }
}

canvasSketch(sketch, settings);
