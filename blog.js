/* ============================================================
Zeeshan Ali — Writing / Blog 
Cards and full article bodies live in the static HTML (so they 
are crawlable / indexable). This script just wires the cards to 
an in-page reader modal that clones the matching <article>. 
============================================================ */ 
(function () { 
'use strict'; 
var grid = document.getElementById('postGrid'); 
var sources = document.getElementById('postSources'); 
var modal = document.getElementById('postModal'); 
var content = document.getElementById('postContent'); 
  var closeBtn = document.getElementById('postClose'); 
  var backdrop = document.getElementById('postBackdrop'); 
  if (!grid || !modal || !sources) return; 
 
  function openPost(id) { 
    var source = document.getElementById('src-' + id); 
    if (!source) return; 
    content.innerHTML = '<div class="post-article">' + source.innerHTML + '</div>'; 
    content.scrollTop = 0; 
    modal.classList.add('open'); 
    modal.setAttribute('aria-hidden', 'false'); 
    document.body.style.overflow = 'hidden'; 
    setTimeout(function () { closeBtn.focus(); }, 100); 
  } 
 
  function closePost() { 
    modal.classList.remove('open'); 
    modal.setAttribute('aria-hidden', 'true'); 
    document.body.style.overflow = ''; 
  } 
 
  grid.querySelectorAll('.post-card').forEach(function (card) { 
    card.addEventListener('click', function () { openPost(card.getAttribute('data-id')); }); 
  }); 
 
  closeBtn.addEventListener('click', closePost); 
  backdrop.addEventListener('click', closePost); 
  document.addEventListener('keydown', function (e) { 
    if (e.key === 'Escape' && modal.classList.contains('open')) closePost(); 
  }); 
})();