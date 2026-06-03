const supabaseUrl = "https://ffkagrxurtxeixaguvuj.supabase.co";

const supabaseKey = "sb_publishable_9HK9Fx616DpRSfADtRLfAg_fjPDt615";

let supabaseClient = null;

if (window.supabase) {
  supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
  );
}

const WHATSAPP_GOLDCAR = "5577981114345";

const formulario = document.getElementById("formulario");
const servico = document.getElementById("servico");
const local = document.getElementById("local");
const bairro = document.getElementById("bairro");
const valorFinal = document.getElementById("valorFinal");
const data = document.getElementById("data");

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

  let taxaEntrega = 0;

  if (local.value === "Entrega") {
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

servico.addEventListener("change", calcularTotal);
local.addEventListener("change", calcularTotal);
bairro.addEventListener("change", calcularTotal);

formulario.addEventListener("submit", async function(event) {
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

  let mensagem = `🚗 *NOVO ATENDIMENTO GOLDCAR*%0A%0A`;

  mensagem += `👤 *Nome:* ${nome}%0A`;
  mensagem += `📞 *Telefone:* ${telefone}%0A`;
  mensagem += `🚘 *Serviço:* ${servico.value}%0A`;
  mensagem += `📍 *Atendimento:* ${local.value}%0A`;
  mensagem += `🏠 *Bairro:* ${bairro.value || "Não informado"}%0A`;
  mensagem += `📌 *Endereço:* ${endereco || "Não informado"}%0A`;
  mensagem += `🚗 *Modelo:* ${modelo}%0A`;
  mensagem += `🔖 *Placa:* ${placa || "Não informada"}%0A`;
  mensagem += `📅 *Data:* ${data.value || "Por ordem de chegada"}%0A`;
  mensagem += `%0A💰 *Resumo do valor:*%0A`;
  mensagem += `*Serviço:* ${moeda(valores.precoServico)}%0A`;

  if (local.value === "Entrega") {
    mensagem += `*Taxa de entrega:* ${moeda(valores.taxaEntrega)}%0A`;
  }

  mensagem += `*Total:* ${moeda(valores.total)}%0A`;

  if (observacoes) {
    mensagem += `%0A📝 *Observações:* ${observacoes}%0A`;
  }

  if (supabaseClient) {
    const { error } = await supabaseClient
      .from("clientes_goldcar")
      .insert([
        {
          nome: nome,
          telefone: telefone,
          interesse: servico.value,
          mensagem: decodeURIComponent(mensagem)
        }
      ]);

    if (error) {
      console.error(error);
      alert("Erro ao salvar no banco. Mesmo assim vamos abrir o WhatsApp.");
    }
  }

  window.location.href =
    `https://wa.me/${WHATSAPP_GOLDCAR}?text=${mensagem}`;
});

calcularTotal();
