(function () {
  var STORAGE_KEYS = {
    excellent: 'feedback_excellent',
    okay: 'feedback_okay',
    bad: 'feedback_bad'
  };

  var RETURN_DELAY_MS = 1500;

  var screenRate = document.getElementById('screen-rate');
  var screenThanks = document.getElementById('screen-thanks');
  var statsText = document.getElementById('stats-text');
  var resetBtn = document.getElementById('reset-stats');

  function getCount(key) {
    var raw = localStorage.getItem(STORAGE_KEYS[key]);
    var n = parseInt(raw, 10);
    return isNaN(n) ? 0 : n;
  }

  function setCount(key, value) {
    localStorage.setItem(STORAGE_KEYS[key], String(value));
  }

  function updateStatsDisplay() {
    if (!statsText) return;
    var excellent = getCount('excellent');
    var okay = getCount('okay');
    var bad = getCount('bad');
    statsText.textContent = 'Отлично: ' + excellent + ', Нормально: ' + okay + ', Плохо: ' + bad;
  }

  function showRate() {
    screenThanks.classList.add('hidden');
    screenThanks.setAttribute('aria-hidden', 'true');
    screenRate.classList.remove('hidden');
    screenRate.setAttribute('aria-hidden', 'false');
    updateStatsDisplay();
  }

  function showThanks() {
    screenRate.classList.add('hidden');
    screenRate.setAttribute('aria-hidden', 'true');
    screenThanks.classList.remove('hidden');
    screenThanks.setAttribute('aria-hidden', 'false');
    setTimeout(showRate, RETURN_DELAY_MS);
  }

  function handleRatingClick(event) {
    var button = event.target.closest('[data-rating]');
    if (!button) return;
    var rating = button.getAttribute('data-rating');
    if (!STORAGE_KEYS[rating]) return;
    var count = getCount(rating);
    setCount(rating, count + 1);
    showThanks();
  }

  function handleResetClick() {
    setCount('excellent', 0);
    setCount('okay', 0);
    setCount('bad', 0);
    updateStatsDisplay();
  }

  screenRate.addEventListener('click', handleRatingClick);
  if (resetBtn) resetBtn.addEventListener('click', handleResetClick);

  updateStatsDisplay();
})();
