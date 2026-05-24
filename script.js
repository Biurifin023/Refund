//Seleciona os elementos do formulário.
const form = document.querySelector('form')
const amount = document.getElementById('amount')
const expense = document.getElementById('expense')
const category = document.getElementById('category')

// Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

//Captura o evento de input para formatar o valor.
amount.oninput = () => {
    //Obtém o valor atual do input e remove os caracteres não numericos.
    let value = amount.value.replace(/\D/g, "")

    value = Number(value) / 100

    // Atualiza o valor do input.
    amount.value = formatCurrencyBRL(value) 
}

function formatCurrencyBRL(value) {
    // Formata o valor no padrão BRL.
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })
    // Retorna o valor formatado.
    return value
}

// Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {
    //Previne o comportamento padrão de recarregar a pag.
    event.preventDefault()

    // Cria um objeto com os detalhes na nova despesa.
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(), 
    }
    expenseAdd(newExpense)
}

//Adiciona a despesa na lista.
function expenseAdd(newExpense) {
    try{
    // Cria o elemento para adicionar o (li) na lista (ul).
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")
    //Cria o icone da categoria.
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)
    
    // Cria info da despesa.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    //Cria o nome da despesa.
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    //Cria a categoria da despesa.
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    //Adiciona o nome e categoria na div das informações da despesa.
    expenseInfo.append(expenseName, expenseCategory) 
    

    //Cria o valor da despesa.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$","")}`

    // Cria o icone de remover
    const removeIcon = document.createElement("img")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "remover")
    removeIcon.classList.add("remove-icon")

    //Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo,expenseAmount,removeIcon)

    //Adiciona o item na lista.
    expenseList.append(expenseItem)

    //Limpa o formulário.
    formClear()

    //Atualiza os totais.
    updateTotals()
} 

    catch (error) {
        alert("Não foi possível atualizar a lista de despesas.")
        console.log(error)
    }
}

//Atualiza os totais.
function updateTotals() {
    try{
        //Obtém todos os itens da lista.
        const items = expenseList.children

        //Atualiza a quantidade de despesas.
        expenseQuantity.textContent = `${items.length} ${
            items.length > 1 ? "despesas" : "despesa"
        }`

        //Variavel para incrementar o total.
        let total = 0

        //percorre todos os itens(li) da lista(ul).
        for(let item = 0; item < items.length; item++) {
            //Obtém o valor da despesa.
            const itemAmount = items[item].querySelector(".expense-amount")
            
            //Remove os caracteres não numéricos e substitui a vírgula por um ponto.
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

            // Converte o valor para float.
            value = parseFloat(value)

            // Verifica se o valor é um número válido.
            if(isNaN(value)) {
                return alert("Valor inválido.")
            }

            // Incrementa o total.
            total += Number(value)
        }

        // Cria a span para adicionar o R$ formatado.
        const symbolBRL = document.createElement("span")
        symbolBRL.textContent = "R$"

        //Formata o valor e remove o R$ que sera exibido pela small com estilo customizado.
        total = formatCurrencyBRL(total).toUpperCase().replace("R$","")

        //Limpa o conteudo do elemento.
        expensesTotal.innerHTML = ""

        //Adiciona o R$ e o valor formatado.
        expensesTotal.append(symbolBRL, total)

    }catch (error) {
        alert("Não foi possível atualizar os totais.")
        console.log(error)
    }
}

// Evento que captura o clique no icone de remover.
expenseList.addEventListener("click", (event) => {
    //Verifica se o clique foi no icone de remover.
    if(event.target.classList.contains("remove-icon")) {
        //Obtem a li pai do icone de remover.
        const item = event.target.closest(".expense")
        item.remove()
    }
    //Atualiza os totais.
    updateTotals()

})

function formClear() {
    //Limpa o campo de nome da despesa.
    expense.value = ""
    amount.value = ""
    category.value = ""
    //Foca no campo de nome da despesa.
    expense.focus()
}
