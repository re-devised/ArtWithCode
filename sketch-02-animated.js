const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')


const settings = {
  dimensions: [ 1080 , 1080 ],
  animate: true
};



const sketch = ({ context, width, height, frame }) => {
  
  const framesPerLoop = 30
  
  const cx = width   * 0.5
  const cy = height  * 0.5
  const w = width   * 0.01
  const h = height  * 0.1
  
  const num = 40
  const radius = width * 0.3
  const slice = math.degToRad(360 / num)
  
  
  //create Lines Objects
  let x, y, xScale, yScale, angle, startingPoint
  const lines = []
  for (let i = 0; i < num; i++){ 
        
    angle         = slice * i
    x             = cx + radius * Math.sin(angle)
    y             = cy + radius * Math.cos(angle)
    xScale        = random.range(0.1, 1.5)
    yScale        = random.range(0.2, 1)
    startingPoint = random.rangeFloor(0, -h/2) 
    
    lines.push(new Line(x,y,xScale,yScale,angle,startingPoint))
  } 


  let drawRadius, lineWidth, startDrawPoint, endDrawPoint, velocity, isAccent
  const arcs = []
  for (let i = 0; i < num; i++){ 
        
    angle          = slice * i
    lineWidth      = random.range(5, 20)
    drawRadius     = radius*random.range(0.7, 1.3)
    startDrawPoint = slice*random.range(1, -8)
    endDrawPoint   = slice*random.range(1,5)
    velocity       = random.range(0.005,0.1)
    isAccent       = random.range(0,1) > 0.9 ? true : false
    
    arcs.push(new Arc(angle,lineWidth,drawRadius,startDrawPoint,endDrawPoint,velocity,isAccent))
  } 


  
  //update Function
  return ({ context, width, height, frame }) => {
    
    context.fillStyle = '#edf2f4';
    context.fillRect(0, 0, width, height);


    
    context.fillStyle = '#2b2d42'
    context.lineWidth = width * 0.01


    lines.forEach(line => {

      context.save()
      context.translate(line.x,line.y)
      context.rotate(-line.angle)
      context.scale(line.xScale, line.yScale)
  
      if(line.movementDirection == "outwards"){
        if(line.currentPoint == -h/2){
          line.movementDirection = "inwards"
          line.currentPoint += 1
        }else{
          line.currentPoint -= 1
        }
      }else if(line.movementDirection == "inwards"){
        if(line.currentPoint == 0){
          line.movementDirection = "outwards"
          line.currentPoint -= 1
        }else{
          line.currentPoint += 1
        }
      }

      context.beginPath()
      context.rect(-w/2,line.currentPoint,w,h)
      context.fill()
      context.restore()
    }) 

    arcs.forEach(arc => {

      context.save()
      context.translate(cx,cy)
      context.rotate(-arc.angle)

      context.lineWidth = arc.lineWidth
      context.strokeStyle = arc.isAccent ? '#eb5e28' : '#2b2d42'


      arc.startDrawPoint += arc.velocity
      arc.endDrawPoint += arc.velocity
      
      context.beginPath()
      context.arc(0,0, arc.drawRadius, arc.startDrawPoint, arc.endDrawPoint)
      context.stroke()
      context.restore()
    })

  };
};

class Line {
  constructor(x,y, xScale, yScale, angle, startingPoint, movementDirection="outwards"){
    this.x = x
    this.y = y
    this.xScale = xScale
    this.yScale = yScale
    this.angle = angle
    this.currentPoint = startingPoint
    this.movementDirection = movementDirection
  }
}

class Arc {
  constructor(angle, lineWidth, drawRadius, startDrawPoint, endDrawPoint, velocity, isAccent=false){
    this.angle = angle
    this.lineWidth = lineWidth
    this.drawRadius = drawRadius
    this.startDrawPoint = startDrawPoint
    this.endDrawPoint = endDrawPoint
    this.velocity = velocity
    this.isAccent = isAccent
  }
}

canvasSketch(sketch, settings);
