// ---------------------------------------------------------------------------
// Função para carregar dados do servidor
// ---------------------------------------------------------------------------

async function getList (tipo) {
    let url = 'http://127.0.0.1:5000/'+tipo
    try{
        const init = {
            method: 'GET'
        }
        const response = await fetch(url, init)
        const responseJSON = await response.json()

        let tarefas = responseJSON.tarefasList
        
        for(let i of tarefas){
            let tarefa = []

            tarefa.push(i.id)
            tarefa.push(i.titulo)
            tarefa.push(i.descricao)
            tarefa.push(i.data_criacao)
            tarefa.push(i.data_conclusao)
            tarefa.push(i.status)

            showList(tarefa)
        }

    } catch (e) {
        console.warn('ERRO NO CONSUMO DA API TAREFA - GET', e)
    }
};

// ---------------------------------------------------------------------------
// Invocação da função getList para popular tela com todas as tarefas
// ---------------------------------------------------------------------------

getList('tarefas')

// ---------------------------------------------------------------------------
// Invocação da função getList com dados do campo de busca por Título
// ---------------------------------------------------------------------------

function buscaPorTitulo(titulo){
    let texto = document.getElementById('inputBuscar').value
    refreshList('tarefaTitulo')
    getList('tarefaTitulo?titulo='+texto)
}

// ---------------------------------------------------------------------------
// Função para salvar nova tarefa no banco de dados
// ---------------------------------------------------------------------------

async function salvarTarefa(){

    let inputTitulo = document.getElementById('inputTitulo')
    let inputDescricao = document.getElementById('inputDescricao')
    let url = 'http://127.0.0.1:5000/tarefa'

    if(inputTitulo.value === ''){
        alert('Informe o Título')
        console.log('entrou....')
    } else if ( inputDescricao.value === '') {
        alert('Informe a Descrição')
        console.log('entrou....')
    } else {

    const formData = new FormData()
    formData.append('titulo', inputTitulo.value)
    formData.append('descricao', inputDescricao.value)

    try{
        const init = {
            method: 'POST',
            body: formData
        }
        const response = await fetch(url, init)

        }catch (e){
            console.warn('ERRO NO CONSUMO DA API TAREFA - POST', e)
        }

    refreshList('tarefas')
    esconderForm()
    alert('Tarefa criada com sucesso!')
    }
}

// ---------------------------------------------------------------------------
// função para atualizar Tarefa existente
// ---------------------------------------------------------------------------

async function updateTarefa(tarefa_id) {
    url = 'http://127.0.0.1:5000/tarefa?id='+tarefa_id

    const formData = new FormData()
    formData.append('status', true)
    if(confirm('Tem certeza que deseja encerrar esta tarefa?')){ 
        try{
            const init = {
                method: 'PUT',
                body: formData
            }
            const response = await fetch(url, init)

            alert('Tarefa atualizada com sucesso!')
            refreshList('tarefas')

        } catch (e){
            console.warn('ERRO NO CONSUMO DA API TAREFA - PUT', e)
        }
    }
}

// ---------------------------------------------------------------------------
// função para mostrar lista de tarefas na tela
// ---------------------------------------------------------------------------

function showList (tarefa) {
    let table = document.getElementById('tableList')
    let body = document.getElementById('tableBody')
    table.appendChild(body)
    let linha = body.insertRow()
    
    for(let i in tarefa){
        let cel = linha.insertCell(i)

        cel.classList.add(`td-${i}`)

        if (tarefa[i] === false) {
            cel.textContent = 'Pendente'
            continue
        } 
        if(tarefa[i] === true){
            cel.textContent = 'Encerrada'
            continue
        }
        cel.textContent = tarefa[i]
    }
    
    // O bloco de texto abaixo criará duas céluas em cada nova linha
    // onde em cada uma terá um botão de ação

    let btnEncerrar = document.createElement('button')
    let btnExcluir = document.createElement('button')

    btnEncerrar.textContent = 'Encerrar'
    btnExcluir.textContent = 'Excluir'

    btnEncerrar.classList.add('btn', 'btnEncerrar')
    btnEncerrar.setAttribute('onClick', `updateTarefa(${tarefa[0]})`)
    btnEncerrar.setAttribute('id', `td-${6}`)
    if(tarefa[5] == true){
        btnEncerrar.setAttribute('disabled', true)
        btnEncerrar.classList.add('btnDisabled')
    }
    
    btnExcluir.classList.add('btn', 'btnExcluir')
    btnExcluir.setAttribute('onClick', `deleteTarefa(${tarefa[0]})`)
    btnExcluir.setAttribute('id', `td-${7}`)
    if(tarefa[5] == true){
        btnExcluir.setAttribute('disabled', true)
        btnExcluir.classList.add('btnDisabled')
    }

    let linha6 = linha.insertCell(6)
    linha6.classList.add('td-6')
    linha6.appendChild(btnEncerrar)
    
    let linha7 = linha.insertCell(7)
    linha7.classList.add('td-7')
    linha7.appendChild(btnExcluir)
    
}
// ---------------------------------------------------------------------------
// função para deletar Tarefa existente
// ---------------------------------------------------------------------------

async function deleteTarefa(tarefa_id){
    let url = 'http://127.0.0.1:5000/tarefa?id='+tarefa_id

    if(confirm('Tem certeza que deseja deletar esta tarefa?')){
        try{
            const init = {
                method: 'DELETE'
            }
            const response = await fetch(url, init)

            alert('Tarefa deletada com sucesso!')
            refreshList('tarefas')
        } catch (e){
            console.warn('ERRO NO CONSUMO DA API TAREFA - DELETE', e)
        }
    }
}

// ---------------------------------------------------------------------------
// Função para atualizar e recarregar a tabela de tarefas
// ---------------------------------------------------------------------------

function refreshList (tipo) {
    let bodyTable = document.getElementById('tableBody')
    while(bodyTable.firstChild) {
        bodyTable.removeChild(bodyTable.firstChild)
    }
    
    document.getElementById('inputBuscar').value = ''
    
    if(tipo == 'tarefas')
        getList('tarefas')
}

// ---------------------------------------------------------------------------
// Função para mostrar formulário de inclusão de tarefa
// ---------------------------------------------------------------------------

function mostrarForm() {
    let section = document.getElementById('sectionNovaTarefa')
    section.style.display = 'flex'    
}

// ---------------------------------------------------------------------------
// Função para ocultar formulário de inclusão de tarefa
// ---------------------------------------------------------------------------

function esconderForm() {
    let section = document.getElementById('sectionNovaTarefa')
    section.style.display = 'none'
    limpaInputs()
}

// ---------------------------------------------------------------------------
// Função para limpar campos
// ---------------------------------------------------------------------------

function limpaInputs() {
    document.getElementById('inputTitulo').value = ''
    document.getElementById('inputDescricao').value = ''
}
