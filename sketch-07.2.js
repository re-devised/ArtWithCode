const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')
const Tweakpane = require('tweakpane')



const settings = {
  dimensions: [ 1850, 1850 ],
  // animate: true
};

const params = {
  glyphValuesSection1: '',
  glyphValuesSection2: 'o',
  glyphValuesSection3: '=',
  glyphValuesSection4: '/',
  glyphValuesSection5: '.',
  section1Max: 0,
  section2Max: 40,
  section3Max: 90,
  section4Max: 160
}

let manager
let image

let fontFamily = 'sans-serif'


const typeCanvas = document.createElement('canvas')
const typeContext = typeCanvas.getContext('2d')


const sketch = ({ context, width, height }) => {
  
  const cell = 20
  const cols = Math.floor(width / cell)
  const rows = Math.floor(height / cell)
  const numCells = cols * rows
  
  const scale = 3
  typeCanvas.width = cols
  typeCanvas.height = rows
  
  
  return ({ context, width, height }) => {
    // typeContext.fillStyle = 'grey';
    typeContext.fillRect(0, 0, cols, rows)
    
    
    let imageWidthOnCanvas
    let imageHeightOnCanvas
    
    if(width > image.width){
      imageWidthOnCanvas = width-(width-image.width)
    }else{
      imageWidthOnCanvas = width
    }
    if(height > image.height){
      imageHeightOnCanvas = height-(height-image.height)
    }else{
      imageHeightOnCanvas = height
    }
    
    typeContext.save()
    // typeContext.translate(width*0.5, height*0.5)
    typeContext.drawImage(image, 0, 0, 
      imageWidthOnCanvas, imageHeightOnCanvas, 
      0, 0, 
      cols,
      rows
    )
    typeContext.restore()
  



    // context.fillStyle = 'white'
    // context.fillRect(0,0, width, height)       
    const typeData = typeContext.getImageData(0,0,cols,rows).data    
    
    const getPixelDataAtPixelIndex = (i) => {
      const col = i % cols
      const row = Math.floor(i / cols)

      const x = col*cell
      const y = row*cell

      const r = typeData[i*4 + 0]
      const g = typeData[i*4 + 1]
      const b = typeData[i*4 + 2]
      const a = typeData[i*4 + 3]
      
      return {x,y,r,g,b,a}
    }

    // //drawing whole pixels (rects) of image
    // for (let i = 0; i < numCells; i++){
    //   const {x,y,r,g,b,a} = getPixelDataAtPixelIndex(i)
      
    //   context.save()
    //   context.translate(x,y)
    //   context.fillStyle = `rgb(${r},${g},${b})`

    //   // context.translate(cell*0.5, 0)
    //   context.fillRect(0,0,cell,cell)
    //   context.beginPath()

    //   context.restore()
    // }

    //drawing letters and dashes and so on
    for (let i = 0; i < numCells; i++){
      const {x,y,r,g,b,a} = getPixelDataAtPixelIndex(i)

      context.save()
      context.translate(x,y)
      context.fillStyle = `rgb(0,0,0)`

      context.font = `${cell*2}px ${fontFamily}`
      // if(Math.random() < 0.1) context.font = `${cell*6}px ${fontFamily}`
      const glyph = getGlyph(0.299*r + 0.587*g + 0.114*b)

      context.translate(cell*0.5, cell*0.5)
      if(a > 0) context.fillText(glyph, 0, 0)
      
      context.restore()
    }

    // context.drawImage(typeCanvas, 0, 0, 
    //   typeCanvas.width*scale, typeCanvas.height*scale)

  
  };
};

const getGlyph = (v) => {
  let glyphSelectionArray

       if(v < params.section1Max) glyphSelectionArray = params.glyphValuesSection1.split('')
  else if(v < params.section2Max) glyphSelectionArray = params.glyphValuesSection2.split('')
  else if(v < params.section3Max) glyphSelectionArray = params.glyphValuesSection3.split('')
  else if(v < params.section4Max) glyphSelectionArray = params.glyphValuesSection4.split('')
  else if(v < 256               ) glyphSelectionArray = params.glyphValuesSection5.split('')
  
  if(!glyphSelectionArray[0]) glyphSelectionArray[0] = ''
  return random.pick(glyphSelectionArray)
}




const proxy = "https://corsproxy.felixschaefer.access.ly/"
const url = proxy + "https://cdn.pixabay.com/photo/2022/06/16/10/13/flower-7265594_1280.jpg"

const loadImageFromUrl = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject()
    img.src = url
  })
}
const loadImageFromPath = (path) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject()
    img.src = path
  })
}


const createPane = () => {
  const pane = new Tweakpane.Pane()
  let folder

  folder = pane.addFolder({title: 'Glyphs', expanded: false})
  folder.addInput(params, 'glyphValuesSection1')
  folder.addInput(params, 'glyphValuesSection2')
  folder.addInput(params, 'glyphValuesSection3')
  folder.addInput(params, 'glyphValuesSection4')
  folder.addInput(params, 'glyphValuesSection5')


  folder = pane.addFolder({title: 'Color Sections', expanded: false})
  folder.addInput(params, 'section1Max', {min:1, max:251})
  folder.addInput(params, 'section2Max', {min:2, max:252})
  folder.addInput(params, 'section3Max', {min:3, max:253})
  folder.addInput(params, 'section4Max', {min:4, max:254})


  pane.on('change', () => manager.render())
}

const start = async () => {
  image = await loadImageFromPath("./source.png")
  createPane()
  manager = await canvasSketch(sketch, settings);
}
start()