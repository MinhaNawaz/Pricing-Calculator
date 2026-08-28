(function(){
  const plans = {
    starter: { name: 'Starter plan', price: 19 },
    team:    { name: 'Team plan',    price: 39 },
    scale:   { name: 'Scale plan',   price: 79 },
  };
  const regions = {
    'none':  { label: 'No sales tax', rate: 0 },
    'us-ca': { label: 'Sales tax (CA · 8.5%)', rate: 0.085 },
    'us-ny': { label: 'Sales tax (NY · 8.875%)', rate: 0.08875 },
    'uk':    { label: 'VAT (UK · 20%)', rate: 0.20 },
    'eu':    { label: 'VAT (EU · 21%)', rate: 0.21 },
  };

  const state = {
    plan: 'team',
    seats: 12,
    cycle: 'monthly',
    addons: { support: false, analytics: false, sso: false },
    region: 'none',
  };

  const $ = (id) => document.getElementById(id);
  const fmt = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function volumeRate(seats){
    if (seats >= 100) return 0.20;
    if (seats >= 50)  return 0.12;
    if (seats >= 10)  return 0.05;
    return 0;
  }

  function clampSeats(v){
    v = Math.round(v);
    if (isNaN(v)) v = 1;
    return Math.min(200, Math.max(1, v));
  }

  function render(){
    const plan = plans[state.plan];
    const seats = state.seats;
    const planSubtotal = plan.price * seats;

    const addonMeta = [
      { key:'support',   name:'Priority support',   price:49 },
      { key:'analytics', name:'Advanced analytics', price:79 },
      { key:'sso',       name:'SSO & SCIM',         price:99 },
    ];
    const activeAddons = addonMeta.filter(a => state.addons[a.key]);
    const addonsTotal = activeAddons.reduce((s,a) => s + a.price, 0);

    const subtotal = planSubtotal + addonsTotal;

    const vRate = volumeRate(seats);
    const vAmt = planSubtotal * vRate;
    const afterVolume = subtotal - vAmt;

    const annual = state.cycle === 'annual';
    const annualAmt = annual ? afterVolume * 0.15 : 0;
    const afterAnnual = afterVolume - annualAmt;

    const region = regions[state.region];
    const taxAmt = afterAnnual * region.rate;

    const total = afterAnnual + taxAmt;
    const annualBilled = total * 12;

    // Plan line
    $('rPlanName').textContent = plan.name;
    $('rPlanSub').textContent = seats + ' seat' + (seats === 1 ? '' : 's') + ' × $' + plan.price.toFixed(2);
    $('rPlanAmt').textContent = fmt(planSubtotal);

    // Addon lines
    const addonWrap = $('rAddonLines');
    addonWrap.innerHTML = '';
    activeAddons.forEach(a => {
      const row = document.createElement('div');
      row.className = 'r-line';
      row.innerHTML = '<div class="l-name">' + a.name + '</div><div class="l-amt">' + fmt(a.price) + '</div>';
      addonWrap.appendChild(row);
    });

    $('rSubtotal').textContent = fmt(subtotal);

    // Volume discount
    if (vRate > 0){
      $('rVolumeLine').style.display = 'flex';
      $('rVolumeName').textContent = 'Volume discount (' + Math.round(vRate*100) + '%)';
      $('rVolumeAmt').textContent = '–' + fmt(vAmt);
    } else {
      $('rVolumeLine').style.display = 'none';
    }

    // Annual discount
    if (annual){
      $('rAnnualLine').style.display = 'flex';
      $('rAnnualAmt').textContent = '–' + fmt(annualAmt);
    } else {
      $('rAnnualLine').style.display = 'none';
    }

    // Tax
    $('rTaxName').textContent = region.label;
    $('rTaxAmt').textContent = fmt(taxAmt);

    // Total
    const totalEl = $('rTotal');
    totalEl.textContent = fmt(total);
    totalEl.classList.remove('flash');
    void totalEl.offsetWidth;
    totalEl.classList.add('flash');

    $('rCycleLabel').textContent = 'per month';

    if (annual){
      $('rAnnualSummary').style.display = 'flex';
      $('rAnnualTotal').textContent = fmt(annualBilled) + ' / yr';
    } else {
      $('rAnnualSummary').style.display = 'none';
    }

    // Volume badge under seats
    const badge = $('volumeBadge');
    if (vRate > 0){
      badge.textContent = Math.round(vRate*100) + '% volume discount applied';
      badge.classList.add('show');
    } else {
      badge.classList.remove('show');
    }

    $('rStamp').textContent = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  }

  // Plan buttons
  const planButtons = document.querySelectorAll('.plan-btn');
  function syncPlanButtons(){
    planButtons.forEach(b => b.classList.toggle('active', b.dataset.plan === state.plan));
  }
  planButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      state.plan = btn.dataset.plan;
      syncPlanButtons();
      render();
    });
  });

  // Seats
  const seatInput = $('seatInput');
  const seatSlider = $('seatSlider');
  function setSeats(v){
    state.seats = clampSeats(v);
    seatInput.value = state.seats;
    seatSlider.value = state.seats;
    render();
  }
  $('seatMinus').addEventListener('click', () => setSeats(state.seats - 1));
  $('seatPlus').addEventListener('click', () => setSeats(state.seats + 1));
  seatInput.addEventListener('input', () => setSeats(parseInt(seatInput.value || '1', 10)));
  seatInput.addEventListener('blur', () => setSeats(parseInt(seatInput.value || '1', 10)));
  seatSlider.addEventListener('input', () => setSeats(parseInt(seatSlider.value, 10)));

  // Cycle toggle
  const cycleButtons = document.querySelectorAll('#cycleToggle button');
  cycleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      state.cycle = btn.dataset.cycle;
      cycleButtons.forEach(b => b.classList.toggle('active', b === btn));
      $('cycleNote').style.visibility = state.cycle === 'annual' ? 'visible' : 'hidden';
      render();
    });
  });

  // Addons
  document.querySelectorAll('.addon').forEach(row => {
    row.addEventListener('click', () => {
      const key = row.dataset.addon;
      state.addons[key] = !state.addons[key];
      row.classList.toggle('checked', state.addons[key]);
      render();
    });
  });

  // Region
  $('region').addEventListener('change', (e) => {
    state.region = e.target.value;
    render();
  });

  // Init
  syncPlanButtons();
  document.querySelector('.plan-btn[data-plan="team"]').classList.add('active');
  render();
})();
