function setLocation(t){const el=document.getElementById("locationText");if(el)el.textContent="📍 "+t}
if(navigator.geolocation){navigator.geolocation.getCurrentPosition(p=>{setLocation(`Location detected • ${p.coords.latitude.toFixed(2)}, ${p.coords.longitude.toFixed(2)}`)},()=>setLocation("Location unavailable"),{timeout:8000})}else setLocation("Location unavailable");
