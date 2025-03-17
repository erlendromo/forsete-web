let file = document.getElementById("inputDocument").files[0];
let formData = new FormData();
     
formData.append("file", file);
fetch('/upload/file', {method: "POST", body: formData});

async function SaveFile(inp) 
{
    let formData = new FormData();
    let file = inp.files[0];      
         
    formData.append("file", file);
    
    const ctrl = new AbortController()    // timeout
    setTimeout(() => ctrl.abort(), 5000);
    
    try {
       let r = await fetch('/upload/file', 
         {method: "POST", body: formData, signal: ctrl.signal}); 
       console.log('HTTP response code:',r.status); 
    } catch(e) {
       console.log('Houston we have problem...:', e);
    }
    
}