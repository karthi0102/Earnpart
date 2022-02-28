// const imageUpload = document.getElementById('imageUpload')
const video=document.getElementById('video');
        var  canvas=document.getElementById('canvas');
        const snap=document.getElementById('snap');
        const errorMsgElement=document.getElementById('spanErrorMsg');

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)


const constrains={
  audio:false,
  video:{
      width:1280,height:720
  }
};
async function init(){
  try{
      const stream =await navigator.mediaDevices.getUserMedia(constrains);
      handleSuccess(stream);

  }
  catch(e)
  {
      errorMsgElement.innerHTML=`navigator.getUserMedia.error:${e.toString()}`;
  }
}

function handleSuccess(stream){
  window.stream=stream;
  video.srcObject=stream;
  console.log(stream);

}

init();







async function start() {
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  let image
 // let canvas
  document.body.append('Loaded')
  // imageUpload.addEventListener('change', async () => {
 var context =canvas.getContext('2d');
    snap.addEventListener("click",async ()=>{
      
     


    if (image) image.remove()
    if (canvas) canvas.remove()
    context.drawImage(video, 0, 0, 640, 480);
    
    var fullQuality = canvas.toDataURL('image/jpeg', 1.0);
console.log(fullQuality);
   
   image = await faceapi.fetchImage(`${fullQuality}`)
    container.append(image)
   //const img1= await canvas.loadImage(image)
    canvas = await faceapi.createCanvasFromMedia(image)
   container.append(canvas)
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    console.log(detections);
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    console.log(resizedDetections)
    const results = resizedDetections.map(d =>faceMatcher.findBestMatch(d.descriptor))
    console.log(results);
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      console.log(box)
      console.log(result.toString().slice(0,6))
      if(result.toString().slice(0,6)==='unknow')
      {
        alert('hii');
      }
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      drawBox.draw(canvas)
    })
  })
}

function loadLabeledImages() {
  const labels = [username]

  return Promise.all(
    labels.map(async label => {
     
      
      const descriptions = []
  
        const img = await faceapi.fetchImage(dpImg)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
        console.log(detections);
      
        console.log(descriptions+'1');
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
    
  )
}

      


 