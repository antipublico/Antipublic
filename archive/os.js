(function OS() {
  const wins = [...document.querySelectorAll('.window[data-app]')];
  let zTop = 100;

  // Dragging and focus
  wins.forEach(win => {
    const bar = win.querySelector('[data-drag]');
    let offX=0, offY=0, dragging=false;

    const bringFront = () => { zTop += 1; win.style.zIndex = zTop; };
    win.addEventListener('mousedown', bringFront);

    bar.addEventListener('mousedown', e=>{
      dragging=true; offX=e.clientX - win.offsetLeft; offY=e.clientY - win.offsetTop; bringFront();
    });
    window.addEventListener('mousemove', e=>{
      if(!dragging) return; win.style.left=(e.clientX-offX)+'px'; win.style.top=(e.clientY-offY)+'px';
    });
    window.addEventListener('mouseup', ()=> dragging=false);

    // Touch
    bar.addEventListener('touchstart', e=>{ const t=e.touches[0]; dragging=true; offX=t.clientX-win.offsetLeft; offY=t.clientY-win.offsetTop; bringFront(); });
    window.addEventListener('touchmove', e=>{ if(!dragging) return; const t=e.touches[0]; win.style.left=(t.clientX-offX)+'px'; win.style.top=(t.clientY-offY)+'px'; });
    window.addEventListener('touchend', ()=> dragging=false);
  });

  // Window management
  const state = {};
  wins.forEach(w=>{ state[w.dataset.app] = { open: true, el: w, title: w.querySelector('.title')?.textContent || w.dataset.app }; });

  function show(app){ const s=state[app]; if(!s) return; s.open=true; s.el.style.display='block'; s.el.focus(); }
  function hide(app){ const s=state[app]; if(!s) return; s.open=false; s.el.style.display='none'; }

  // Controls
  wins.forEach(w=>{
    w.querySelector('.btn-min')?.addEventListener('click', ()=> hide(w.dataset.app));
    w.querySelector('.btn-close')?.addEventListener('click', ()=> hide(w.dataset.app));
  });

  // Start menu
  const startBtn = document.getElementById('start-btn');
  const menu = document.getElementById('startmenu');
  const menuList = document.getElementById('menu-list');

  function renderMenu(){
    menuList.innerHTML='';
    Object.keys(state).forEach(app=>{
      const item=document.createElement('button');
      item.className='menu-item';
      item.textContent = state[app].title;
      item.addEventListener('click', ()=>{ show(app); menu.style.display='none'; });
      menuList.appendChild(item);
    });
  }
  renderMenu();

  startBtn?.addEventListener('click', ()=>{
    menu.style.display = menu.style.display==='block' ? 'none' : 'block';
  });
  window.addEventListener('click', (e)=>{
    if(!menu.contains(e.target) && e.target!==startBtn) menu.style.display='none';
  });

  // Taskbar quick open
  document.querySelectorAll('[data-open]').forEach(btn=>{
    btn.addEventListener('click', ()=> show(btn.getAttribute('data-open')));
  });

  // Terminal
  const termInput = document.getElementById('term-input');
  const termOutput = document.getElementById('term-output');
  if(termInput && termOutput){
    termInput.addEventListener('keydown', e=>{
      if(e.key !== 'Enter') return;
      const cmd = termInput.value.trim();
      termInput.value = '';
      if(!cmd) return;
      termOutput.textContent += '\n$ ' + cmd;
      const response = runCmd(cmd);
      if(response) termOutput.textContent += '\n' + response;
      termOutput.scrollTop = termOutput.scrollHeight;
    });
  }

  function runCmd(c){
    const lc = c.toLowerCase();
    if(lc==='help') return 'Available: help, clear, date, echo <text>, ls';
    if(lc==='clear'){ termOutput.textContent='$'; return ''; }
    if(lc==='date') return new Date().toString();
    if(lc.startsWith('echo ')) return c.slice(5);
    if(lc==='ls') return 'presage2  notes.md  audio1.mp3  dani.jpg';
    return c + ': command not found';
  }

  // Shutdown
  document.getElementById('shutdown-btn')?.addEventListener('click', ()=>{
    if(confirm('Turn off and return to Antipublic?')) window.location.href='/';
  });

  // Music player
  const audio = document.getElementById('music-audio');
  const trackList = document.getElementById('track-list');
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const nowPlaying = document.getElementById('now-playing');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  
  const tracks = [
    {file:'audio1.mp3', name:'2010 justin bieber'},
    {file:'audio2.mp3', name:'true: perspective'},
    {file:'audio3.mp3', name:'tropical remix'},
    {file:'audio4.mp3', name:'tragic freestyle'},
    {file:'audio5.mp3', name:'jumanji'},
    {file:'audio6.mp3', name:'top boy'},
    {file:'audio7.mp3', name:'sospechoso 24'},
    {file:'audio8.mp3', name:'wflytd'},
    {file:'audio9.mp3', name:'trauma'},
    {file:'audio10.mp3', name:'no preguntes'},
    {file:'audio11.mp3', name:'interlude'},
    {file:'audio12.mp3', name:'homicide'}
  ];
  
  let currentTrack = 0;
  
  if(audio && trackList){
    tracks.forEach((t,i)=>{
      const item = document.createElement('div');
      item.className = 'track-item' + (i===0?' active':'');
      item.textContent = t.name;
      item.addEventListener('click', ()=> loadTrack(i));
      trackList.appendChild(item);
    });
    
    function loadTrack(i){
      currentTrack = i;
      audio.src = './' + tracks[i].file;
      nowPlaying.textContent = tracks[i].name;
      trackList.querySelectorAll('.track-item').forEach((x,j)=> x.classList.toggle('active', j===i));
      audio.play();
      playBtn.textContent = '⏸';
    }
    
    playBtn?.addEventListener('click', ()=>{
      if(audio.paused){ audio.play(); playBtn.textContent='⏸'; }
      else{ audio.pause(); playBtn.textContent='▶'; }
    });
    
    prevBtn?.addEventListener('click', ()=> loadTrack((currentTrack - 1 + tracks.length) % tracks.length));
    nextBtn?.addEventListener('click', ()=> loadTrack((currentTrack + 1) % tracks.length));
    
    audio.addEventListener('timeupdate', ()=>{
      const pct = (audio.currentTime / audio.duration) * 100 || 0;
      progressFill.style.width = pct + '%';
      currentTimeEl.textContent = formatTime(audio.currentTime);
      totalTimeEl.textContent = formatTime(audio.duration);
    });
    
    progressBar?.addEventListener('click', e=>{
      const rect = progressBar.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
    });
    
    audio.addEventListener('ended', ()=> loadTrack((currentTrack + 1) % tracks.length));
    
    loadTrack(0);
  }
  
  function formatTime(s){
    if(isNaN(s)) return '0:00';
    const m = Math.floor(s/60);
    const sec = Math.floor(s%60);
    return m + ':' + (sec<10?'0':'') + sec;
  }

  // Photo viewer
  const photoDisplay = document.getElementById('photo-display');
  const photoListEl = document.getElementById('photo-list');
  const photos = ['dani.jpg','preview.png'];
  if(photoDisplay && photoListEl){
    photos.forEach((p,i)=>{
      const thumb = document.createElement('img');
      thumb.className = 'photo-thumb' + (i===0?' active':'');
      thumb.src = './' + p;
      thumb.addEventListener('click', ()=>{
        photoDisplay.src = './' + p;
        photoListEl.querySelectorAll('.photo-thumb').forEach(x=>x.classList.remove('active'));
        thumb.classList.add('active');
      });
      photoListEl.appendChild(thumb);
    });
  }
})();
