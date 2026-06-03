const WHATSAPP_GOLDCAR = "5577981114345";

const formulario = document.getElementById("formulario");
const servico = document.getElementById("servico");
const local = document.getElementById("local");
const bairro = document.getElementById("bairro");
const valorFinal = document.getElementById("valorFinal");
const data = document.getElementById("data");
const horario = document.getElementById("horario");

const horariosDisponiveis = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00"
];

function moeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function calcularTotal() {
  const precoServico = Number(
    servico.options[servico.selectedIndex]?.dataset.preco || 0
  );

  const tipoAtendimento = local.value;

  let taxaEntrega = 0;

  if (tipoAtendimento === "Entrega") {
    taxaEntrega = Number(
      bairro.options[bairro.selectedIndex]?.dataset.taxa || 5
    );
  }

  const total = precoServico + taxaEntrega;

  valorFinal.textContent = moeda(total);

  return {
    total,
    precoServico,
    taxaEntrega
  };
}

function carregarHorarios() {
  horario.innerHTML = '<option value="">Escolha um horário</option>';

  if (!data.value) return;

  horariosDisponiveis.forEach(function(hora) {
    const option = document.createElement("option");
    option.value = hora;
    option.textContent = hora;
    horario.appendChild(option);
  });
}

servico.addEventListener("change", calcularTotal);
local.addEventListener("change", calcularTotal);
bairro.addEventListener("change", calcularTotal);
data.addEventListener("change", carregarHorarios);

formulario.addEventListener("submit", function(event) {
  event.preventDefault();

  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  const valores = calcularTotal();

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const modelo = document.getElementById("modelo").value;
  const placa = document.getElementById("placa").value;
  const endereco = document.getElementById("endereco").value;
  const observacoes = document.getElementById("observacoes").value;

  let mensagem = `🚗 *NOVO AGENDAMENTO GOLDCAR*%0A%0A`;

  mensagem += `👤 *Nome:* ${nome}%0A`;
  mensagem += `📞 *Telefone:* ${telefone}%0A`;
  mensagem += `🚘 *Serviço:* ${servico.value}%0A`;
  mensagem += `📍 *Atendimento:* ${local.value}%0A`;
  mensagem += `🏠 *Bairro:* ${bairro.value || "Não informado"}%0A`;
  mensagem += `📌 *Endereço:* ${endereco || "Não informado"}%0A`;
  mensagem += `🚗 *Modelo:* ${modelo}%0A`;
  mensagem += `🔖 *Placa:* ${placa || "Não informada"}%0A`;
  mensagem += `📅 *Data:* ${data.value}%0A`;
  mensagem += `⏰ *Horário:* ${horario.value}%0A`;
  mensagem += `%0A💰 *Resumo do valor:*%0A`;
  mensagem += `*Serviço:* ${moeda(valores.precoServico)}%0A`;

  if (local.value === "Entrega") {
    mensagem += `*Taxa de entrega:* ${moeda(valores.taxaEntrega)}%0A`;
  }

  mensagem += `*Total:* ${moeda(valores.total)}%0A`;

  if (observacoes) {
    mensagem += `%0A📝 *Observações:* ${observacoes}%0A`;
  }

  window.location.href =
    `https://wa.me/${WHATSAPP_GOLDCAR}?text=${mensagem}`;
});

calcularTotal();
