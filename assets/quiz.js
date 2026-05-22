
function initQuiz(questions){
  let index = parseInt(localStorage.getItem(location.pathname + ':index') || '0', 10);
  if(index >= questions.length) index = 0;
  let selected = null;
  let corrected = false;
  const state = {score: parseInt(localStorage.getItem(location.pathname + ':score') || '0',10), seen: JSON.parse(localStorage.getItem(location.pathname + ':seen') || '[]')};
  const qEl = document.getElementById('question');
  const optsEl = document.getElementById('options');
  const feedbackEl = document.getElementById('feedback');
  const progressEl = document.getElementById('progressbar');
  const counterEl = document.getElementById('counter');
  const scoreEl = document.getElementById('score');
  function save(){ localStorage.setItem(location.pathname + ':index', index); localStorage.setItem(location.pathname + ':score', state.score); localStorage.setItem(location.pathname + ':seen', JSON.stringify(state.seen)); }
  function render(){
    const q = questions[index];
    selected = null; corrected = false;
    qEl.textContent = q.q;
    optsEl.innerHTML = '';
    feedbackEl.innerHTML = '';
    counterEl.textContent = `Question ${index+1} / ${questions.length}`;
    scoreEl.textContent = `Score : ${state.score}`;
    progressEl.style.width = `${((index)/questions.length)*100}%`;
    q.options.forEach((opt,i)=>{
      const b = document.createElement('button');
      b.className = 'option';
      b.textContent = opt;
      b.onclick = ()=>{ if(corrected) return; selected = i; [...optsEl.children].forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); };
      optsEl.appendChild(b);
    });
    save();
  }
  document.getElementById('check').onclick = ()=>{
    if(selected===null || corrected) return;
    corrected = true;
    const q = questions[index];
    [...optsEl.children].forEach((b,i)=>{
      if(i===q.answer) b.classList.add('good');
      if(i===selected && i!==q.answer) b.classList.add('bad');
    });
    const firstTime = !state.seen.includes(index);
    if(selected===q.answer){
      if(firstTime) state.score++;
      feedbackEl.innerHTML = `<div class="feedback good">Bonne réponse ✅</div>`;
    } else {
      feedbackEl.innerHTML = `<div class="feedback bad">Pas tout à fait. ${q.explain}</div>`;
    }
    if(firstTime) state.seen.push(index);
    scoreEl.textContent = `Score : ${state.score}`;
    save();
  };
  document.getElementById('next').onclick = ()=>{ index = (index+1)%questions.length; render(); };
  document.getElementById('prev').onclick = ()=>{ index = (index-1+questions.length)%questions.length; render(); };
  const shuffleBtn = document.getElementById('shuffle');
  if(shuffleBtn) shuffleBtn.onclick = ()=>{
    for(let i=questions.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [questions[i],questions[j]]=[questions[j],questions[i]];
    }
    index=0; render();
  }
  render();
}
