const API_BASE = 'http://localhost:3000/api';

// Elementos
const amountEl = document.getElementById('amount');
const fromEl = document.getElementById('fromCurrency');
const toEl = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const saveBtn = document.getElementById('saveBtn');
const resultEl = document.getElementById('result');
const historyTableBody = document.querySelector('#historyTable tbody');

const currencies = ['BRL','USD','EUR','GBP','JPY'];

// Popula selects
currencies.forEach(c => {
  const opt1 = document.createElement('option'); opt1.value=c; opt1.textContent=c;
  const opt2 = document.createElement('option'); opt2.value=c; opt2.textContent=c;
  fromEl.appendChild(opt1);
  toEl.appendChild(opt2);
});
fromEl.value='USD'; toEl.value='BRL';

// Converter
async function convert() {
  const amount = parseFloat(amountEl.value);
  const from = fromEl.value;
  const to = toEl.value;
  if (!amount) return alert('Digite um valor');

  const res = await fetch(`${API_BASE}/convert?from=${from}&to=${to}&amount=${amount}`);
  const data = await res.json();
  resultEl.textContent = `${data.amount} ${data.from} = ${data.converted.toFixed(4)} ${data.to}`;
  // guarda temporariamente para salvar
  resultEl.dataset.last = JSON.stringify({ from_currency:data.from, to_currency:data.to, amount:data.amount, result:data.converted, rate:data.rate });
}

// Salvar no histórico (Create)
async function saveConversion() {
  const last = resultEl.dataset.last;
  if (!last) return alert('Faça uma conversão antes de salvar');

  const payload = JSON.parse(last);
  await fetch(`${API_BASE}/conversions`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });
  loadHistory();
}

// Carregar histórico (Read)
async function loadHistory() {
  const res = await fetch(`${API_BASE}/conversions`);
  const data = await res.json();
  historyTableBody.innerHTML='';
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.id}</td>
      <td>${row.from_currency}</td>
      <td>${row.to_currency}</td>
      <td>${row.amount}</td>
      <td>${row.result}</td>
      <td>
        <button data-id="${row.id}" class="edit">Editar</button>
        <button data-id="${row.id}" class="delete">Excluir</button>
      </td>`;
    historyTableBody.appendChild(tr);
  });
}

// Eventos CRUD
convertBtn.addEventListener('click', convert);
saveBtn.addEventListener('click', saveConversion);

historyTableBody.addEventListener('click', async (e)=>{
  const id = e.target.dataset.id;
  if(e.target.matches('.delete')) {
    if(!confirm('Excluir essa conversão?')) return;
    await fetch(`${API_BASE}/conversions/${id}`, { method:'DELETE' });
    loadHistory();
  }
  else if(e.target.matches('.edit')) {
    const newAmount = prompt('Novo valor:');
    if(newAmount===null) return;

    const row = Array.from(historyTableBody.querySelectorAll('tr'))
                    .find(tr=>tr.children[0].textContent==id);
    const from=row.children[1].textContent;
    const to=row.children[2].textContent;

    const convRes = await fetch(`${API_BASE}/convert?from=${from}&to=${to}&amount=${newAmount}`);
    const convData = await convRes.json();

    const payload={
      from_currency:convData.from,
      to_currency:convData.to,
      amount:convData.amount,
      result:convData.converted,
      rate:convData.rate
    };

    await fetch(`${API_BASE}/conversions/${id}`,{
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    loadHistory();
  }
});

loadHistory();
