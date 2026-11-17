function updateClock(){const el=document.getElementById("clock");if(el)el.textContent=new Intl.DateTimeFormat([], {hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date())}updateClock();setInterval(updateClock,1000);


