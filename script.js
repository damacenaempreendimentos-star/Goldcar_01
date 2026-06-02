const WHATSAPP_GOLDCAR = "5577981114345";

const formulario = document.getElementById("formulario");
const servico = document.getElementById("servico");
const local = document.getElementById("local");
const valorFinal = document.getElementById("valorFinal");
const camposResidencia = document.getElementById("camposResidencia");

const modelo = document.getElementById("modelo");
const ano = document.getElementById("ano");
const placa = document.getElementById("placa");
const endereco = document.getElementById("endereco");

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function calcularTotal() {
  const precoServico = Number(servico.options[servico.selectedIndex]?.dataset.preco || 0);
  const precoLocal = Number(local.options[local.selectedIndex]?.dataset.extra || 0);

  const total = precoServico + precoLocal;
  valorFinal.textContent = formatarMoeda(total);

  return total;
}

function atualizarCampos() {
  const entregaResidencia = local.value === "Entrega na residência";

  camposResidencia.classList.toggle("escondido", !entregaResidencia);

  modelo.required = entregaResidencia;
  ano.required = entregaResidencia;
  placa.required = entregaResidencia;
  endereco.required = entregaResidencia;
}

servico.addEventListener("change", calcularTotal);

local.addEventListener("change", () => {
  calcularTotal();
  atualizarCampos();
});

formulario.addEventListener("submit", function(event) {
  event.preventDefault();

  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  const total = calcularTotal();

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const data = document.getElementById("data").value;
  const horario = document.getElementById("horario").value;
  const observacoes = document.getElementById("observacoes").value;

  let mensagem = `Olá, Goldcar Lava Rápido! Quero fazer um agendamento.%0A%0A`;
  mensagem += `*Nome:* ${nome}%0A`;
  mensagem += `*Telefone:* ${telefone}%0A`;
  mensagem += `*Serviço:* ${servico.value}%0A`;
  mensagem += `*Local:* ${local.value}%0A`;
  mensagem += `*Valor final:* ${formatarMoeda(total)}%0A`;
  mensagem += `*Data:* ${data}%0A`;
  mensagem += `*Horário:* ${horario}%0A`;

  if (local.value === "Entrega na residência") {
    mensagem += `%0A*Dados do veículo:*%0A`;
    mensagem += `*Modelo:* ${modelo.value}%0A`;
    mensagem += `*Ano:* ${ano.value}%0A`;
    mensagem += `*Placa:* ${placa.value}%0A`;
    mensagem += `*Endereço:* ${endereco.value}%0A`;
  }

  if (observacoes) {
    mensagem += `%0A*Observações:* ${observacoes}%0A`;
  }

  const link = `https://wa.me/${WHATSAPP_GOLDCAR}?text=${mensagem}`;

  window.open(link, "_blank");
});

calcularTotal();
atualizarCampos();
