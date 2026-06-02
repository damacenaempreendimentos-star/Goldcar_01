const WHATSAPP_GOLDCAR = "5577981114345";

const formulario = document.getElementById("formulario");
const servico = document.getElementById("servico");
const local = document.getElementById("local");
const valorFinal = document.getElementById("valorFinal");

function moeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function calcularTotal() {
  const precoServico = Number(servico.options[servico.selectedIndex]?.dataset.preco || 0);
  const taxaLocal = Number(local.options[local.selectedIndex]?.dataset.extra || 0);

  const total = precoServico + taxaLocal;
  valorFinal.textContent = moeda(total);

  return total;
}

servico.addEventListener("change", calcularTotal);
local.addEventListener("change", calcularTotal);

formulario.addEventListener("submit", function(event) {
  event.preventDefault();

  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  const total = calcularTotal();

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const modelo = document.getElementById("modelo").value;
  const placa = document.getElementById("placa").value;
  const bairro = document.getElementById("bairro").value;
  const endereco = document.getElementById("endereco").value;
  const data = document.getElementById("data").value;
  const horario = document.getElementById("horario").value;
  const observacoes = document.getElementById("observacoes").value;

  let mensagem = `Olá, Goldcar Lava Rápido! Quero fazer um agendamento.%0A%0A`;
  mensagem += `*Nome:* ${nome}%0A`;
  mensagem += `*Telefone:* ${telefone}%0A`;
  mensagem += `*Serviço:* ${servico.value}%0A`;
  mensagem += `*Tipo de atendimento:* ${local.value}%0A`;
  mensagem += `*Valor inicial:* ${moeda(total)}%0A`;

  if (local.value === "Entrega") {
    mensagem += `*Aviso:* A entrega tem taxa mínima de R$ 5,00 e pode variar conforme o bairro.%0A`;
  }

  mensagem += `%0A*Dados do veículo:*%0A`;
  mensagem += `*Modelo:* ${modelo}%0A`;
  mensagem += `*Placa:* ${placa}%0A`;
  mensagem += `*Bairro:* ${bairro}%0A`;
  mensagem += `*Endereço:* ${endereco}%0A`;
  mensagem += `*Data:* ${data}%0A`;
  mensagem += `*Horário:* ${horario}%0A`;

  if (observacoes) {
    mensagem += `%0A*Observações:* ${observacoes}%0A`;
  }

  const link = `https://wa.me/${WHATSAPP_GOLDCAR}?text=${mensagem}`;
  window.open(link, "_blank");
});

calcularTotal();
