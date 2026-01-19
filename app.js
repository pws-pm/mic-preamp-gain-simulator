let nextId = 1;

const MICS = [
  { id: nextId++, name: 'Shure SM58', type: 'Dynamic', sensDbu: -52.4 },
  { id: nextId++, name: 'Shure Beta 58A', type: 'Dynamic', sensDbu: -49.3 },
  { id: nextId++, name: 'Shure Beta 57A', type: 'Dynamic', sensDbu: -48.8 },
  { id: nextId++, name: 'Shure KSM8', type: 'Dynamic', sensDbu: -49.3 },
  { id: nextId++, name: 'Sennheiser e 835', type: 'Dynamic', sensDbu: -49.2 },
  { id: nextId++, name: 'Sennheiser e 845', type: 'Dynamic', sensDbu: -52.7 },
  { id: nextId++, name: 'Sennheiser e 935', type: 'Dynamic', sensDbu: -48.8 },
  { id: nextId++, name: 'Sennheiser e 945', type: 'Dynamic', sensDbu: -51.8 },
  { id: nextId++, name: 'Audio-Technica ATM510', type: 'Dynamic', sensDbu: -53.2 },
  { id: nextId++, name: 'Audio-Technica ATM610a', type: 'Dynamic', sensDbu: -53.2 },
  { id: nextId++, name: 'Shure Beta 87A', type: 'Electret condenser', sensDbu: -50.2 },
  { id: nextId++, name: 'Shure Beta 87C', type: 'Electret condenser', sensDbu: -48.8 },
  { id: nextId++, name: 'Shure KSM32', type: 'Electret condenser', sensDbu: -33.7 },
  { id: nextId++, name: 'Sennheiser e 865', type: 'Electret condenser', sensDbu: -48.2 },
  { id: nextId++, name: 'Audio-Technica ATM710', type: 'Electret condenser', sensDbu: -37.8 },
  { id: nextId++, name: 'Audio-Technica AT2020', type: 'Electret condenser', sensDbu: -34.8 },
  { id: nextId++, name: 'Audio-Technica AT2035', type: 'Electret condenser', sensDbu: -30.8 },
  { id: nextId++, name: 'Shure KSM42', type: 'Externally polarized condenser', sensDbu: -34.8 },
  { id: nextId++, name: 'Shure KSM44A (cardioid)', type: 'Externally polarized condenser', sensDbu: -28.3 },
  { id: nextId++, name: 'Sennheiser MK 4', type: 'Externally polarized condenser', sensDbu: -29.8 },
  { id: nextId++, name: 'Sennheiser MK 8', type: 'Externally polarized condenser', sensDbu: -34.8 },
  { id: nextId++, name: 'Audio-Technica AT4040', type: 'Externally polarized condenser', sensDbu: -29.8 },
  { id: nextId++, name: 'Audio-Technica AT4050', type: 'Externally polarized condenser', sensDbu: -33.8 },
  { id: nextId++, name: 'Shure MX412/C', type: 'Electret condenser', sensDbu: -32.8, gooseneck: true },
  { id: nextId++, name: 'Shure MX418/S', type: 'Electret condenser', sensDbu: -31.8, gooseneck: true },
  { id: nextId++, name: 'Audio-Technica U857QL', type: 'Electret condenser', sensDbu: -36.8, gooseneck: true },
  { id: nextId++, name: 'AtlasIED M600-DT', type: 'Electret condenser', sensDbu: -32.8, gooseneck: true },
  { id: nextId++, name: 'CAD Audio AMC105-2-19', type: 'Dynamic', sensDbu: -53.8, gooseneck: true },
  { id: nextId++, name: 'Electro-Voice PC Plus', type: 'Electret condenser', sensDbu: -42.8, gooseneck: true }
];

const REF_DISTANCE_CM = 30;

const ui = {
  adcDbu: document.getElementById('adcDbu'),
  gainDb: document.getElementById('gainDb'),
  gainDbRange: document.getElementById('gainDbRange'),
  sensUnit: document.getElementById('sensUnit'),
  splDb: document.getElementById('splDb'),
  splDbRange: document.getElementById('splDbRange'),
  splPresets: document.getElementById('splPresets'),
  distanceCm: document.getElementById('distanceCm'),
  distanceCmRange: document.getElementById('distanceCmRange'),
  floorDbfs: document.getElementById('floorDbfs'),
  micTable: document.getElementById('micTable'),
  meterAxis: document.getElementById('meterAxis'),
  meterPlot: document.getElementById('meterPlot'),
  meterBars: document.getElementById('meterBars'),
  targetLine: document.getElementById('targetLine'),
  dbList: document.getElementById('dbList'),
  addMicForm: document.getElementById('addMicForm'),
  addMicName: document.getElementById('addMicName'),
  addMicType: document.getElementById('addMicType'),
  addMicSens: document.getElementById('addMicSens'),
  addMicGooseneck: document.getElementById('addMicGooseneck'),
  sensUnitLabelTable: document.getElementById('sensUnitLabelTable'),
  sensUnitLabelDb: document.getElementById('sensUnitLabelDb'),
  sensUnitLabelForm: document.getElementById('sensUnitLabelForm'),
  fsDbu: document.getElementById('fsDbu'),
  splOffset: document.getElementById('splOffset'),
  distanceGain: document.getElementById('distanceGain'),
  micCount: document.getElementById('micCount'),
  typeFilters: document.getElementById('typeFilters'),
  viewTabs: document.getElementById('viewTabs')
};

let activeType = 'all';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const readNumber = (input, fallback) => {
  const value = parseFloat(input.value);
  return Number.isFinite(value) ? value : fallback;
};

const DBU_PER_DBV = 20 * Math.log10(1 / 0.775);

const dbuToUnit = (dbu, unit) => {
  if (unit === 'dBV') return dbu - DBU_PER_DBV;
  if (unit === 'mV') return 0.775 * Math.pow(10, dbu / 20) * 1000;
  return dbu;
};

const unitToDbu = (value, unit) => {
  if (unit === 'dBV') return value + DBU_PER_DBV;
  if (unit === 'mV') return 20 * Math.log10((value / 1000) / 0.775);
  return value;
};

const formatSensitivity = (dbu, unit) => {
  const value = dbuToUnit(dbu, unit);
  if (unit === 'mV') {
    return `${value.toFixed(1)} mV`;
  }
  return `${value.toFixed(1)} ${unit}`;
};

const updateSensitivityLabels = (unit) => {
  ui.sensUnitLabelTable.textContent = unit;
  ui.sensUnitLabelDb.textContent = unit;
  ui.sensUnitLabelForm.textContent = unit;
  ui.addMicSens.step = unit === 'mV' ? '0.1' : '0.1';
};

const formatDb = (value) => `${value.toFixed(1)} dB`;
const formatDbu = (value) => `${value.toFixed(1)} dBu`;
const formatDbfs = (value) => {
  if (value > 0) {
    return `+${value.toFixed(1)} dBFS`;
  }
  return `${value.toFixed(1)} dBFS`;
};

const getInputs = () => {
  const adcDbu = clamp(readNumber(ui.adcDbu, 15), -6, 30);
  const gainDb = clamp(readNumber(ui.gainDb, 40), -10, 80);
  const splDb = clamp(readNumber(ui.splDb, 94), 60, 130);
  const distanceCm = clamp(readNumber(ui.distanceCm, REF_DISTANCE_CM), 2, 60);
  const floorDbfs = clamp(readNumber(ui.floorDbfs, -60), -120, -20);

  return { adcDbu, gainDb, splDb, distanceCm, floorDbfs };
};

const computeDbfs = (mic, settings) => {
  const splOffset = settings.splDb - 94;
  const distanceGain = 20 * Math.log10(REF_DISTANCE_CM / settings.distanceCm);
  const totalOffset = splOffset + distanceGain;
  const micOutDbu = mic.sensDbu + totalOffset;
  const preampOutDbu = micOutDbu + settings.gainDb;
  const dbfs = preampOutDbu - settings.adcDbu;

  return {
    dbfs,
    micOutDbu,
    preampOutDbu,
    splOffset,
    distanceGain
  };
};

const classifyDbfs = (dbfs) => {
  if (dbfs > 0) return 'clip';
  if (dbfs > -6) return 'warn';
  return 'ok';
};

const render = () => {
  const settings = getInputs();
  const sensUnit = ui.sensUnit.value || 'dBu';
  const splOffset = settings.splDb - 94;
  const distanceGain = 20 * Math.log10(REF_DISTANCE_CM / settings.distanceCm);
  const range = 0 - settings.floorDbfs;
  const targetDbfs = -18;

  updateSensitivityLabels(sensUnit);
  ui.fsDbu.textContent = formatDbu(settings.adcDbu);
  ui.splOffset.textContent = formatDb(splOffset);
  ui.distanceGain.textContent = formatDb(distanceGain);

  const filtered = MICS.filter((mic) => {
    if (activeType === 'all') return true;
    if (activeType === 'Gooseneck') return mic.gooseneck;
    return mic.type === activeType;
  });
  ui.micCount.textContent = filtered.length.toString();

  const tableFragment = document.createDocumentFragment();
  const meterFragment = document.createDocumentFragment();

  filtered.forEach((mic) => {
    const result = computeDbfs(mic, settings);
    const row = document.createElement('tr');

    const statusClass = `status-${classifyDbfs(result.dbfs)}`;
    row.innerHTML = `
      <td>${mic.name}</td>
      <td>${mic.type}</td>
      <td>${formatSensitivity(mic.sensDbu, sensUnit)}</td>
      <td>${result.micOutDbu.toFixed(1)} dBu</td>
      <td>${result.preampOutDbu.toFixed(1)} dBu</td>
      <td class="${statusClass}">${formatDbfs(result.dbfs)}</td>
    `;

    tableFragment.appendChild(row);

    const column = document.createElement('div');
    column.className = 'meter-column';
    column.title = `${mic.name} - ${formatDbfs(result.dbfs)}`;

    const bar = document.createElement('div');
    bar.className = 'meter-bar';

    const fill = document.createElement('div');
    fill.className = `meter-fill ${classifyDbfs(result.dbfs)}`;

    const clamped = clamp(result.dbfs, settings.floorDbfs, 0);
    const height = ((clamped - settings.floorDbfs) / range) * 100;
    fill.style.height = `${height}%`;

    bar.appendChild(fill);

    const label = document.createElement('div');
    label.className = 'meter-label';
    label.textContent = mic.name;

    column.appendChild(bar);
    column.appendChild(label);
    meterFragment.appendChild(column);
  });

  ui.micTable.innerHTML = '';
  ui.micTable.appendChild(tableFragment);

  ui.meterBars.innerHTML = '';
  ui.meterBars.appendChild(meterFragment);

  const dbFragment = document.createDocumentFragment();
  MICS.forEach((mic) => {
    const row = document.createElement('tr');
    const typeLabel = mic.gooseneck ? `${mic.type} (Gooseneck)` : mic.type;
    row.innerHTML = `
      <td>${mic.name}</td>
      <td>${typeLabel}</td>
      <td>${formatSensitivity(mic.sensDbu, sensUnit)}</td>
      <td><button class="ghost" type="button" data-remove="${mic.id}">Remove</button></td>
    `;
    dbFragment.appendChild(row);
  });
  ui.dbList.innerHTML = '';
  ui.dbList.appendChild(dbFragment);

  const gridStep = (6 / range) * 100;
  ui.meterPlot.style.setProperty('--grid-step', `${gridStep}%`);

  const targetPosition = clamp(targetDbfs, settings.floorDbfs, 0);
  const targetPercent = ((targetPosition - settings.floorDbfs) / range) * 100;
  ui.targetLine.style.bottom = `${targetPercent}%`;

  ui.meterAxis.innerHTML = '';
  const tickStep = 6;
  for (let db = 0; db >= settings.floorDbfs; db -= tickStep) {
    if (db < settings.floorDbfs) break;
    const isMajor = db % 12 === 0 || db === 0 || db === -18 || db === settings.floorDbfs;
    if (!isMajor) continue;
    const label = document.createElement('span');
    label.textContent = `${db} dBFS`;
    const pos = ((db - settings.floorDbfs) / range) * 100;
    label.style.bottom = `${pos}%`;
    ui.meterAxis.appendChild(label);
  }
  if (settings.floorDbfs % tickStep !== 0) {
    const label = document.createElement('span');
    label.textContent = `${settings.floorDbfs} dBFS`;
    label.style.bottom = '0%';
    ui.meterAxis.appendChild(label);
  }
};

const syncControls = () => {
  const syncRange = (input, range) => {
    const value = parseFloat(input.value);
    if (Number.isFinite(value)) {
      range.value = value;
    }
  };

  const clampInput = (input, min, max, decimals = 0) => {
    const value = readNumber(input, min);
    const clamped = clamp(value, min, max);
    input.value = decimals > 0 ? clamped.toFixed(decimals) : Math.round(clamped).toString();
    return clamped;
  };

  ui.gainDb.addEventListener('input', () => {
    syncRange(ui.gainDb, ui.gainDbRange);
    render();
  });

  ui.gainDb.addEventListener('change', () => {
    const value = clampInput(ui.gainDb, -10, 80, 1);
    ui.gainDbRange.value = value.toFixed(1);
    render();
  });

  ui.gainDbRange.addEventListener('input', () => {
    ui.gainDb.value = ui.gainDbRange.value;
    render();
  });

  ui.splDb.addEventListener('input', () => {
    syncRange(ui.splDb, ui.splDbRange);
    render();
  });

  ui.splDb.addEventListener('change', () => {
    const value = clampInput(ui.splDb, 60, 130, 0);
    ui.splDbRange.value = value.toFixed(0);
    render();
  });

  ui.splDbRange.addEventListener('input', () => {
    ui.splDb.value = ui.splDbRange.value;
    render();
  });

  ui.distanceCm.addEventListener('input', () => {
    syncRange(ui.distanceCm, ui.distanceCmRange);
    render();
  });

  ui.distanceCm.addEventListener('change', () => {
    const value = clampInput(ui.distanceCm, 2, 60, 0);
    ui.distanceCmRange.value = value.toFixed(0);
    render();
  });

  ui.distanceCmRange.addEventListener('input', () => {
    ui.distanceCm.value = ui.distanceCmRange.value;
    render();
  });

  ui.adcDbu.addEventListener('input', render);
  ui.adcDbu.addEventListener('change', () => {
    clampInput(ui.adcDbu, -6, 30, 1);
    render();
  });

  ui.floorDbfs.addEventListener('input', render);
  ui.floorDbfs.addEventListener('change', () => {
    clampInput(ui.floorDbfs, -120, -20, 0);
    render();
  });
};

const setupFilters = () => {
  ui.typeFilters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-type]');
    if (!button) return;

    ui.typeFilters.querySelectorAll('.chip').forEach((chip) => chip.classList.remove('active'));
    button.classList.add('active');
    activeType = button.dataset.type;
    render();
  });
};

const setupPresets = () => {
  ui.splPresets.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-spl]');
    if (!button) return;
    const value = parseFloat(button.dataset.spl);
    if (Number.isNaN(value)) return;
    ui.splDb.value = value.toFixed(0);
    ui.splDbRange.value = value.toFixed(0);
    render();
  });
};

const setupDatabase = () => {
  ui.dbList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-remove]');
    if (!button) return;
    const id = parseInt(button.dataset.remove, 10);
    const index = MICS.findIndex((mic) => mic.id === id);
    if (index >= 0) {
      MICS.splice(index, 1);
      render();
    }
  });

  ui.addMicForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = ui.addMicName.value.trim();
    const type = ui.addMicType.value;
    const gooseneck = ui.addMicGooseneck.checked;
    const sensUnit = ui.sensUnit.value || 'dBu';
    const sensValue = readNumber(ui.addMicSens, NaN);
    if (!name || !Number.isFinite(sensValue)) return;

    const sensDbu = unitToDbu(sensValue, sensUnit);
    MICS.push({ id: nextId++, name, type, sensDbu, gooseneck });

    ui.addMicName.value = '';
    ui.addMicSens.value = '';
    ui.addMicGooseneck.checked = false;
    render();
  });
};

const setupSensitivityUnit = () => {
  let lastUnit = ui.sensUnit.value || 'dBu';
  updateSensitivityLabels(lastUnit);
  ui.sensUnit.addEventListener('change', () => {
    const nextUnit = ui.sensUnit.value || 'dBu';
    const currentValue = readNumber(ui.addMicSens, NaN);
    if (Number.isFinite(currentValue)) {
      const dbu = unitToDbu(currentValue, lastUnit);
      const converted = dbuToUnit(dbu, nextUnit);
      ui.addMicSens.value = nextUnit === 'mV' ? converted.toFixed(1) : converted.toFixed(1);
    }
    lastUnit = nextUnit;
    updateSensitivityLabels(nextUnit);
    render();
  });
};

const setupViewTabs = () => {
  const panels = document.querySelectorAll('[data-view-panel]');
  ui.viewTabs.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-view]');
    if (!button) return;
    const view = button.dataset.view;
    ui.viewTabs.querySelectorAll('button[data-view]').forEach((tab) => {
      const isActive = tab.dataset.view === view;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-pressed', isActive.toString());
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.viewPanel !== view;
    });
  });
};

syncControls();
setupFilters();
setupPresets();
setupDatabase();
setupSensitivityUnit();
setupViewTabs();
render();
